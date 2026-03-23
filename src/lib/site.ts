export const SITE_NAME = 'Victor Garcia';
export const SITE_DESCRIPTION =
  'Blog sobre inteligencia artificial enfocado en empresas, impacto en LATAM y Venezuela. Noticias, análisis y opinión desde la experiencia de un solopreneur.';

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  );
}

export function buildAbsoluteUrl(pathname = '/') {
  const baseUrl = getSiteUrl();
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(normalizedPath, baseUrl).toString();
}
