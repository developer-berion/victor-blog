import type { MetadataRoute } from 'next';
import { getAllPostSlugs, getCategories } from '@/lib/supabase';
import { buildAbsoluteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '/',
    '/about',
  ].map((path) => ({
    url: buildAbsoluteUrl(path),
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  const [posts, categories] = await Promise.all([
    getAllPostSlugs().catch(() => []),
    getCategories().catch(() => []),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = (categories.length
    ? categories
    : [
        { slug: 'ia-empresas' },
        { slug: 'noticias' },
        { slug: 'latam' },
        { slug: 'opinion' },
      ]
  ).map((category) => ({
    url: buildAbsoluteUrl(`/category/${category.slug}`),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: buildAbsoluteUrl(`/blog/${post.slug}`),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
