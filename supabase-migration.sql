-- Victor AI Blog — Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/otgigfjkouullbruptxp/sql/new

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Authors
CREATE TABLE public.authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio_es TEXT,
  bio_en TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('es', 'en')),
  share_code TEXT UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  social_copy TEXT,
  social_copy_linkedin TEXT,
  social_image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  author_id UUID REFERENCES public.authors(id),
  tags TEXT[] DEFAULT '{}',
  reading_time INT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter subscribers
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  locale TEXT DEFAULT 'es',
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Public read access for blog content
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Authors are viewable by everyone" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Published posts are viewable by everyone" ON public.posts FOR SELECT USING (published = true);
CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);

-- Performance indexes
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_locale ON public.posts(locale);
CREATE INDEX idx_posts_category ON public.posts(category_id);
CREATE INDEX idx_posts_share_code ON public.posts(share_code);
CREATE INDEX idx_posts_published ON public.posts(published, published_at DESC);
CREATE INDEX idx_posts_locale_published ON public.posts(locale, published, published_at DESC);

-- Seed categories
INSERT INTO public.categories (slug, name_es, name_en) VALUES
  ('ai-empresas', 'IA para Empresas', 'AI for Business'),
  ('noticias', 'Noticias', 'News'),
  ('latam', 'Impacto LATAM', 'LATAM Impact'),
  ('opinion', 'Opinión', 'Opinion');

-- Seed default author
INSERT INTO public.authors (name, bio_es, bio_en) VALUES
  ('Victor Rodríguez', 'Fundador y editor de Victor AI. Apasionado por la inteligencia artificial y su impacto en las empresas latinoamericanas.', 'Founder and editor of Victor AI. Passionate about artificial intelligence and its impact on Latin American businesses.');
