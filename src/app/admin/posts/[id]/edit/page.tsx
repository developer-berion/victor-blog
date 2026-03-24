import { notFound, redirect } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { createShareCode, getAdminCategories, getAdminPostById, getDefaultAuthorId } from '@/lib/admin';
import { getAdminPostsPath } from '@/lib/admin-path';
import { getPostShareKit } from '@/lib/social-sharing';
import { getSiteUrl } from '@/lib/site';
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
  const siteUrl = getSiteUrl();
  const shareCode = post?.share_code ?? createShareCode();

  if (!authorId) {
    redirect(`${getAdminPostsPath()}?error=no_author`);
  }

  if (!post) {
    notFound();
  }

  const initialShareKit = getPostShareKit({
    share_code: post.share_code,
    social_copy: post.social_copy,
    social_copy_linkedin: post.social_copy_linkedin,
    social_image_url: post.social_image_url,
    content: post.content,
  });

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {feedback ? <AdminFeedback message={feedback.message} severity={feedback.severity} /> : null}
      <Box>
        <Typography variant="overline" color="primary">
          Admin
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mt: 0.5 }}>
          Editar post
        </Typography>
      </Box>
      <PostForm
        action="/api/admin/posts"
        categories={categories}
        authorId={authorId}
        siteUrl={siteUrl}
        shareCode={initialShareKit.share_code ?? shareCode}
        post={post}
        submitLabel="Guardar cambios"
      />
    </Box>
  );
}
