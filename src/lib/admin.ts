import 'server-only';

import crypto from 'crypto';
import path from 'path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
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

export async function requireAdmin() {
  if (!(await getAdminSession())) {
    redirect('/admin/login');
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

  const { data } = client.storage.from(BLOG_COVERS_BUCKET).getPublicUrl(filePath);
  return {
    path: filePath,
    publicUrl: data.publicUrl,
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
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category_id: string;
  author_id: string;
  tags: string[];
  reading_time: number | null;
  published: boolean;
};

export function parseAdminPostForm(formData: FormData): AdminPostInput {
  const title = String(formData.get('title') ?? '').trim();
  const slugInput = String(formData.get('slug') ?? '').trim();
  const slug = slugify(slugInput || title);
  const locale = String(formData.get('locale') ?? 'es') as 'es' | 'en';
  const excerpt = String(formData.get('excerpt') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const coverImage = String(formData.get('cover_image_url') ?? '').trim();
  const categoryId = String(formData.get('category_id') ?? '').trim();
  const authorId = String(formData.get('author_id') ?? '').trim();
  const tagsRaw = String(formData.get('tags') ?? '').trim();
  const readingTimeRaw = String(formData.get('reading_time') ?? '').trim();
  const published = formData.get('published') === 'on';

  return {
    slug,
    locale: locale === 'en' ? 'en' : 'es',
    title,
    excerpt,
    content,
    cover_image_url: coverImage || null,
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
        ...input,
        published_at: normalizePublishedAt(existing.published_at, input.published),
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
      ...input,
      published_at: input.published ? new Date().toISOString() : null,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data as { id: string };
}

export async function removeAdminPost(postId: string) {
  const { error } = await getAdminSupabase()
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}
