import { redirect } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { getAdminCategories, getDefaultAuthorId } from '@/lib/admin';
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

  if (!authorId) {
    redirect('/admin/posts?error=no_author');
  }

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {feedback ? <AdminFeedback message={feedback.message} severity={feedback.severity} /> : null}
      <Box>
        <Typography variant="overline" color="primary">
          Admin
        </Typography>
        <Typography variant="h4" component="h2" sx={{ mt: 0.5 }}>
          Nuevo post
        </Typography>
      </Box>
      <PostForm
        action="/api/admin/posts"
        categories={categories}
        authorId={authorId}
        submitLabel="Crear post"
      />
    </Box>
  );
}
