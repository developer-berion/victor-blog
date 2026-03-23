import type { ReactNode } from 'react';
import AdminProviders from './AdminProviders';

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <AdminProviders>{children}</AdminProviders>;
}
