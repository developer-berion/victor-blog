export const SITE_NAME = "Victor Garcia";
export const SITE_DESCRIPTION =
  "Blog sobre inteligencia artificial enfocado en empresas, impacto en LATAM y Venezuela. Noticias, análisis y opinión desde la experiencia de un solopreneur.";

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    return siteUrl.replace(/\/+$/, '');
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000';
  }

  throw new Error('Missing NEXT_PUBLIC_SITE_URL');
}

export function buildAbsoluteUrl(pathname = "/") {
  const baseUrl = getSiteUrl();
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(normalizedPath, baseUrl).toString();
}
