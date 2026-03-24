import type { Locale } from './locale';

type TranslationPair = Record<Locale, string>;

const BLOG_TRANSLATIONS: Record<string, TranslationPair> = {
  'la-ia-no-solo-ayuda-tambien-puede-inflar-tu-ego': {
    es: 'la-ia-no-solo-ayuda-tambien-puede-inflar-tu-ego',
    en: 'ai-doesnt-just-help-it-can-inflate-your-ego',
  },
  'ai-doesnt-just-help-it-can-inflate-your-ego': {
    es: 'la-ia-no-solo-ayuda-tambien-puede-inflar-tu-ego',
    en: 'ai-doesnt-just-help-it-can-inflate-your-ego',
  },
};

const BLOG_PATH_REGEX = /^\/blog\/([^/?#]+)\/?$/;

export function getBlogTranslationPair(slug: string): TranslationPair | null {
  return BLOG_TRANSLATIONS[slug] ?? null;
}

export function getLocalizedBlogPath(pathname: string, locale: Locale): string {
  const match = pathname.match(BLOG_PATH_REGEX);
  if (!match) {
    return pathname;
  }

  const pair = BLOG_TRANSLATIONS[match[1]];
  if (!pair) {
    return pathname;
  }

  return `/blog/${pair[locale]}`;
}
