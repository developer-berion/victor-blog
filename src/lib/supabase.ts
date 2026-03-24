import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { extractShareKitFromContent } from './social-sharing';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

/* ---- Types ---- */
export interface Category {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
}

export interface Author {
  id: string;
  name: string;
  bio_es: string | null;
  bio_en: string | null;
  avatar_url: string | null;
  social_links: Record<string, string>;
}

export interface Post {
  id: string;
  slug: string;
  locale: 'es' | 'en';
  share_code: string | null;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  social_copy: string | null;
  social_copy_linkedin: string | null;
  social_image_url: string | null;
  category_id: string;
  author_id: string;
  tags: string[];
  reading_time: number | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  categories?: Category;
  authors?: Author;
}

export interface PublishedPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  locale: 'es' | 'en';
  published_at: string | null;
}

/* ---- Queries ---- */

export async function getPosts(locale: string, limit = 20) {
  const { data, error } = await getSupabase()
    .from('posts')
    .select('*, categories(*), authors(*)')
    .eq('locale', locale)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Post[];
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await getSupabase()
    .from('posts')
    .select('*, categories(*), authors(*)')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) throw error;
  return data as Post;
}

export async function getPostByShareCode(shareCode: string) {
  const client = getSupabase();

  try {
    const { data, error } = await client
      .from('posts')
      .select('*, categories(*), authors(*)')
      .eq('share_code', shareCode)
      .eq('published', true)
      .single();

    if (!error && data) {
      return data as Post;
    }
  } catch {
    // Fallback below for schemas that still store share-kit data inside content.
  }

  const { data, error } = await client
    .from('posts')
    .select('*, categories(*), authors(*)')
    .eq('published', true);

  if (error) throw error;

  const post = (data as Post[]).find((row) => {
    const kit = extractShareKitFromContent(row.content ?? '');
    return kit.share_code === shareCode;
  });

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
}

export async function getAllPublishedPosts() {
  const { data, error } = await getSupabase()
    .from('posts')
    .select('*, categories(*), authors(*)')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function getLatestPublishedPosts(locale: 'es' | 'en', limit = 3) {
  const { data, error } = await getSupabase()
    .from('posts')
    .select('slug, title, excerpt, locale, published_at')
    .eq('locale', locale)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as PublishedPostSummary[];
}

export async function getPostsByCategory(categorySlug: string, locale: string) {
  const { data, error } = await getSupabase()
    .from('posts')
    .select('*, categories!inner(*), authors(*)')
    .eq('categories.slug', categorySlug)
    .eq('locale', locale)
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function getFeaturedPost(locale: string) {
  const { data, error } = await getSupabase()
    .from('posts')
    .select('*, categories(*), authors(*)')
    .eq('locale', locale)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as Post;
}

export async function getCategories() {
  const { data, error } = await getSupabase()
    .from('categories')
    .select('*')
    .order('slug');

  if (error) throw error;
  return data as Category[];
}

export async function getRelatedPosts(currentSlug: string, categoryId: string, locale: string, limit = 3) {
  const { data, error } = await getSupabase()
    .from('posts')
    .select('*, categories(*), authors(*)')
    .eq('locale', locale)
    .eq('published', true)
    .eq('category_id', categoryId)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Post[];
}

export async function subscribeNewsletter(email: string, locale: string = 'es') {
  const { error } = await getSupabase()
    .from('subscribers')
    .insert({ email, locale });

  if (error) {
    if (error.code === '23505') {
      return { success: false, message: 'already_subscribed' };
    }
    throw error;
  }
  return { success: true, message: 'subscribed' };
}

export async function getAllPostSlugs() {
  const { data, error } = await getSupabase()
    .from('posts')
    .select('slug, locale')
    .eq('published', true);

  if (error) throw error;
  return data as { slug: string; locale: string }[];
}
