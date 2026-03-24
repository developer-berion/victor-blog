import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import AdminProviders from './AdminProviders';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-snippet': -1,
      'max-image-preview': 'none',
      'max-video-preview': -1,
    },
  },
};

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <AdminProviders>{children}</AdminProviders>;
}
