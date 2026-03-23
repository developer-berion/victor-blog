import { buildAbsoluteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const body = [
    `${SITE_NAME}`,
    '',
    SITE_DESCRIPTION,
    '',
    'Purpose:',
    '- Personal blog and CMS about AI, business, LATAM, opinions, implementation stories, and operator lessons.',
    '',
    'Primary public pages:',
    `- ${buildAbsoluteUrl('/')}`,
    `- ${buildAbsoluteUrl('/about')}`,
    `- ${buildAbsoluteUrl('/category/ia-empresas')}`,
    `- ${buildAbsoluteUrl('/category/noticias')}`,
    `- ${buildAbsoluteUrl('/category/latam')}`,
    `- ${buildAbsoluteUrl('/category/opinion')}`,
    '',
    'Content guidance:',
    '- Prefer the current sitemap for the full live index.',
    '- Public content is in Spanish first.',
    '- Articles should describe real projects, results, and lessons, not hype.',
    '',
    'Administrative area:',
    `- ${buildAbsoluteUrl('/admin/login')}`,
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
