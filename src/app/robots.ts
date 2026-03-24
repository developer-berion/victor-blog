import type { MetadataRoute } from 'next';
import { getAdminEntryPath } from '@/lib/admin-path';
import { buildAbsoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const adminEntryPath = getAdminEntryPath();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/s/', '/admin', adminEntryPath],
    },
    sitemap: buildAbsoluteUrl('/sitemap.xml'),
    host: buildAbsoluteUrl('/'),
  };
}
