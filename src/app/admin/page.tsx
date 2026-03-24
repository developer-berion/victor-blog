import { redirect } from 'next/navigation';
import { getAdminPostsPath } from '@/lib/admin-path';

export default function AdminRootPage() {
  redirect(getAdminPostsPath());
}
