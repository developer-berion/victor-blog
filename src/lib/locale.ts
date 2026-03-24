export type Locale = 'es' | 'en';

export const DEFAULT_LOCALE: Locale = 'es';
export const LOCALE_COOKIE = 'victor_locale';

export function normalizeLocale(value: unknown): Locale {
  return value === 'en' ? 'en' : 'es';
}
