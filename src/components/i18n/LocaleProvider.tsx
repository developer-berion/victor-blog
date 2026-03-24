'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getLocalizedBlogPath } from '@/lib/blog-translations';
import { LOCALE_COOKIE, type Locale } from '@/lib/locale';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  children: ReactNode;
  initialLocale: Locale;
};

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const persistLocale = useCallback((nextLocale: Locale) => {
    document.documentElement.lang = nextLocale;
    localStorage.setItem(LOCALE_COOKIE, nextLocale);
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, []);

  useEffect(() => {
    persistLocale(locale);
  }, [locale, persistLocale]);

  const updateLocale = useCallback((nextLocale: Locale) => {
    persistLocale(nextLocale);
    setLocaleState(nextLocale);

    const localizedPath = getLocalizedBlogPath(pathname, nextLocale);
    if (localizedPath !== pathname) {
      router.replace(localizedPath);
      return;
    }

    router.refresh();
  }, [pathname, persistLocale, router]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: updateLocale,
      toggleLocale: () => updateLocale(locale === 'es' ? 'en' : 'es'),
    }),
    [locale, updateLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
