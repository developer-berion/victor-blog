import { getAdminPosts } from '@/lib/admin';
import { getAdminFeedback } from '../feedback';
import AdminPostsClient from './AdminPostsClient';

export const dynamic = 'force-dynamic';

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const posts = await getAdminPosts();
  const feedback = getAdminFeedback(searchParams);

  return <AdminPostsClient posts={posts} feedback={feedback} />;
}
