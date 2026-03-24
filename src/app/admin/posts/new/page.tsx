import { redirect } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { createShareCode, getAdminCategories, getDefaultAuthorId } from '@/lib/admin';
import { getAdminPostsPath } from '@/lib/admin-path';
import { getSiteUrl } from '@/lib/site';
import AdminFeedback from '../../AdminFeedback';
import { getAdminFeedback } from '../../feedback';
import PostForm from '../PostForm';

export const dynamic = 'force-dynamic';

export default async function AdminNewPostPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const [categories, authorId] = await Promise.all([
    getAdminCategories(),
    getDefaultAuthorId(),
  ]);
  const feedback = getAdminFeedback(searchParams);
  const siteUrl = getSiteUrl();
  const shareCode = createShareCode();

  if (!authorId) {
    redirect(`${getAdminPostsPath()}?error=no_author`);
  }

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {feedback ? <AdminFeedback message={feedback.message} severity={feedback.severity} /> : null}
      <Box>
        <Typography variant="overline" color="primary">
          Admin
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mt: 0.5 }}>
          Nuevo post
        </Typography>
      </Box>
      <PostForm
        action="/api/admin/posts"
        categories={categories}
        authorId={authorId}
        siteUrl={siteUrl}
        shareCode={shareCode}
        submitLabel="Crear post"
      />
    </Box>
  );
}
