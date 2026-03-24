'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';
import { getAdminEntryPath } from '@/lib/admin-path';
import type { Locale } from '@/lib/locale';

type SiteChromeProps = {
  children: ReactNode;
  initialLocale: Locale;
  hasLocaleCookie: boolean;
};

export default function SiteChrome({ children, initialLocale, hasLocaleCookie }: SiteChromeProps) {
  const pathname = usePathname();
  const adminEntryPath = getAdminEntryPath();
  const isAdminRoute =
    pathname === adminEntryPath ||
    pathname?.startsWith(`${adminEntryPath}/`) ||
    pathname === '/admin' ||
    pathname?.startsWith('/admin/') ||
    false;

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <LocaleProvider initialLocale={initialLocale} hasLocaleCookie={hasLocaleCookie}>
      <Header />
      <main>{children}</main>
      <Footer />
    </LocaleProvider>
  );
}
