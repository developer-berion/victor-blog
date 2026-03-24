import 'server-only';

import crypto from 'crypto';
import path from 'path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { buildMediaProxyUrl, normalizeMediaUrl } from './media';
import {
  ADMIN_ENTRY_HEADER,
  getAdminLoginPath,
} from './admin-path';
import { composeContentWithShareKit } from './social-sharing';
import type { CoverImageEditor, ImageEditor, ImageEditorFormat, SocialImageEditor } from './social-sharing';
import type { Author, Category, Post } from './supabase';

const ADMIN_COOKIE = 'victor_admin_session';
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
export const BLOG_COVERS_BUCKET = 'blog-covers';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getAdminSecret() {
  return requireEnv('SUPABASE_SERVICE_ROLE_KEY');
}

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminSecret();
}

export function getAdminSupabase(): SupabaseClient {
  return createClient(requireEnv('NEXT_PUBLIC_SUPABASE_URL'), getAdminSecret(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function signSession(timestamp: string) {
  return crypto.createHmac('sha256', getAdminSessionSecret()).update(timestamp).digest('hex');
}

export function createAdminSessionToken() {
  const timestamp = String(Date.now());
  return `${timestamp}.${signSession(timestamp)}`;
}

export function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return false;
  const [timestamp, signature] = token.split('.');
  if (!timestamp || !signature) return false;
  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > ADMIN_SESSION_TTL_MS) return false;

  const expected = signSession(timestamp);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function requireAdminEntry() {
  const headerStore = await headers();
  if (headerStore.get(ADMIN_ENTRY_HEADER) !== '1') {
    notFound();
  }
}

export async function requireAdmin() {
  if (!(await getAdminSession())) {
    redirect(getAdminLoginPath());
  }
}

export function validateAdminPassword(password: string) {
  return password === requireEnv('ADMIN_PASSWORD');
}

export function buildAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function slugify(input: string) {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createShareCode() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
}

function getFileExtension(file: File) {
  const extension = path.extname(file.name).toLowerCase();
  if (extension) {
    return extension.startsWith('.') ? extension : `.${extension}`;
  }

  if (file.type === 'image/png') return '.png';
  if (file.type === 'image/webp') return '.webp';
  if (file.type === 'image/gif') return '.gif';
  if (file.type === 'image/jpeg') return '.jpg';
  return '.jpg';
}

export async function uploadAdminCoverImage(file: File, slugHint: string) {
  const client = getAdminSupabase();
  const safeSlug = slugify(slugHint) || 'post';
  const extension = getFileExtension(file);
  const filePath = `${safeSlug}/${Date.now()}-${crypto.randomUUID()}${extension}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await client.storage
    .from(BLOG_COVERS_BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });

  if (error) throw error;

  return {
    path: filePath,
    publicUrl: buildMediaProxyUrl(BLOG_COVERS_BUCKET, filePath),
  };
}

export async function getAdminPosts() {
  const { data, error } = await getAdminSupabase()
    .from('posts')
    .select('*, categories(*), authors(*)')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function getAdminPostById(id: string) {
  const { data, error } = await getAdminSupabase()
    .from('posts')
    .select('*, categories(*), authors(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Post;
}

export async function getAdminCategories() {
  const { data, error } = await getAdminSupabase()
    .from('categories')
    .select('*')
    .order('slug');

  if (error) throw error;
  return data as Category[];
}

export async function getAdminAuthors() {
  const { data, error } = await getAdminSupabase()
    .from('authors')
    .select('*')
    .order('created_at');

  if (error) throw error;
  return data as Author[];
}

export async function getDefaultAuthorId() {
  const authors = await getAdminAuthors();
  return authors[0]?.id ?? null;
}

export type AdminPostInput = {
  slug: string;
  locale: 'es' | 'en';
  share_code: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  social_copy: string | null;
  social_copy_linkedin: string | null;
  social_image_url: string | null;
  social_image_editor: SocialImageEditor | null;
  cover_image_editor: CoverImageEditor | null;
  category_id: string;
  author_id: string;
  tags: string[];
  reading_time: number | null;
  published: boolean;
};

function parseImageEditor(raw: string, format: ImageEditorFormat): ImageEditor | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ImageEditor> | null;
    if (!parsed) return null;

    return {
      format: parsed.format === format ? parsed.format : format,
      zoom: Number.isFinite(Number(parsed.zoom)) ? Number(parsed.zoom) : 1,
      offsetX: Number.isFinite(Number(parsed.offsetX)) ? Number(parsed.offsetX) : 0,
      offsetY: Number.isFinite(Number(parsed.offsetY)) ? Number(parsed.offsetY) : 0,
    };
  } catch {
    return null;
  }
}

export function parseAdminPostForm(formData: FormData): AdminPostInput {
  const title = String(formData.get('title') ?? '').trim();
  const slugInput = String(formData.get('slug') ?? '').trim();
  const slug = slugify(slugInput || title);
  const locale = String(formData.get('locale') ?? 'es') as 'es' | 'en';
  const shareCodeInput = String(formData.get('share_code') ?? '').trim();
  const excerpt = String(formData.get('excerpt') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const coverImage = String(formData.get('cover_image_url') ?? '').trim();
  const socialCopy = String(formData.get('social_copy') ?? '').trim();
  const socialCopyLinkedin = String(formData.get('social_copy_linkedin') ?? '').trim();
  const socialImage = String(formData.get('social_image_url') ?? '').trim();
  const socialImageEditor = parseImageEditor(
    String(formData.get('social_image_editor') ?? '').trim(),
    'instagram-4-5',
  ) as SocialImageEditor | null;
  const coverImageEditor = parseImageEditor(
    String(formData.get('cover_image_editor') ?? '').trim(),
    'article-16-9',
  ) as CoverImageEditor | null;
  const categoryId = String(formData.get('category_id') ?? '').trim();
  const authorId = String(formData.get('author_id') ?? '').trim();
  const tagsRaw = String(formData.get('tags') ?? '').trim();
  const readingTimeRaw = String(formData.get('reading_time') ?? '').trim();
  const published = formData.get('published') === 'on';

  return {
    slug,
    locale: locale === 'en' ? 'en' : 'es',
    share_code: shareCodeInput || createShareCode(),
    title,
    excerpt,
    content,
    cover_image_url: normalizeMediaUrl(coverImage),
    social_copy: socialCopy || null,
    social_copy_linkedin: socialCopyLinkedin || null,
    social_image_url: normalizeMediaUrl(socialImage),
    social_image_editor: socialImageEditor,
    cover_image_editor: coverImageEditor,
    category_id: categoryId,
    author_id: authorId,
    tags: tagsRaw
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    reading_time: readingTimeRaw ? Number(readingTimeRaw) : null,
    published,
  };
}

function normalizePublishedAt(existingPublishedAt: string | null, published: boolean) {
  if (!published) {
    return existingPublishedAt;
  }
  return existingPublishedAt ?? new Date().toISOString();
}

export async function saveAdminPost(postId: string | null, input: AdminPostInput) {
  const client = getAdminSupabase();
  const payload = {
    ...input,
  };
  const fallbackPayload = {
    ...input,
    content: composeContentWithShareKit(input.content, {
      share_code: input.share_code,
      social_copy: input.social_copy,
      social_copy_linkedin: input.social_copy_linkedin,
      social_image_url: input.social_image_url,
      social_image_editor: input.social_image_editor,
      cover_image_editor: input.cover_image_editor,
    }),
  };

  async function persistWithPayload(currentPayload: typeof payload) {
    if (postId) {
      const { data: existing, error: existingError } = await client
        .from('posts')
        .select('published_at')
        .eq('id', postId)
        .single();

      if (existingError) throw existingError;

      const { data, error } = await client
        .from('posts')
        .update({
          ...currentPayload,
          published_at: normalizePublishedAt(existing.published_at, currentPayload.published),
        })
        .eq('id', postId)
        .select('id')
        .single();

      if (error) throw error;
      return data as { id: string };
    }

    const { data, error } = await client
      .from('posts')
      .insert({
        ...currentPayload,
        published_at: currentPayload.published ? new Date().toISOString() : null,
      })
      .select('id')
      .single();

    if (error) throw error;
    return data as { id: string };
  }

  try {
    return await persistWithPayload(payload);
  } catch (error: unknown) {
    const normalizedError = error as { code?: string; message?: string } | null;
    const missingColumn =
      normalizedError?.code === '42703' ||
      normalizedError?.code === 'PGRST204' ||
      /column .* does not exist/i.test(normalizedError?.message ?? '');

    if (!missingColumn) throw error;

    const legacyPayload = {
      slug: input.slug,
      locale: input.locale,
      title: input.title,
      excerpt: input.excerpt,
      content: fallbackPayload.content,
      cover_image_url: input.cover_image_url,
      category_id: input.category_id,
      author_id: input.author_id,
      tags: input.tags,
      reading_time: input.reading_time,
      published: input.published,
      published_at: input.published ? new Date().toISOString() : null,
    };

    if (postId) {
      const { data: existing, error: existingError } = await client
        .from('posts')
        .select('published_at')
        .eq('id', postId)
        .single();

      if (existingError) throw existingError;

      const { data, error: legacyError } = await client
        .from('posts')
        .update({
          ...legacyPayload,
          published_at: normalizePublishedAt(existing.published_at, legacyPayload.published),
        })
        .eq('id', postId)
        .select('id')
        .single();

      if (legacyError) throw legacyError;
      return data as { id: string };
    }

    const { data, error: legacyError } = await client
      .from('posts')
      .insert(legacyPayload)
      .select('id')
      .single();

    if (legacyError) throw legacyError;
    return data as { id: string };
  }
}

export async function removeAdminPost(postId: string) {
  const { error } = await getAdminSupabase()
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}
