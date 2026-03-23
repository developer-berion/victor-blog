import { notFound, redirect } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { getAdminCategories, getAdminPostById, getDefaultAuthorId } from '@/lib/admin';
import AdminFeedback from '../../../AdminFeedback';
import { getAdminFeedback } from '../../../feedback';
import PostForm from '../../PostForm';

export const dynamic = 'force-dynamic';

export default async function AdminEditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { id } = await params;
  const [categories, authorId, post] = await Promise.all([
    getAdminCategories(),
    getDefaultAuthorId(),
    getAdminPostById(id).catch(() => null),
  ]);
  const feedback = getAdminFeedback(searchParams);

  if (!authorId) {
    redirect('/admin/posts?error=no_author');
  }

  if (!post) {
    notFound();
  }

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {feedback ? <AdminFeedback message={feedback.message} severity={feedback.severity} /> : null}
      <Box>
        <Typography variant="overline" color="primary">
          Admin
        </Typography>
        <Typography variant="h4" component="h2" sx={{ mt: 0.5 }}>
          Editar post
        </Typography>
      </Box>
      <PostForm
        action="/api/admin/posts"
        categories={categories}
        authorId={authorId}
        post={post}
        submitLabel="Guardar cambios"
      />
    </Box>
  );
}
