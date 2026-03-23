import { NextResponse } from 'next/server';
import { parseAdminPostForm, requireAdmin, saveAdminPost, uploadAdminCoverImage } from '@/lib/admin';

export async function POST(request: Request) {
  await requireAdmin();

  const formData = await request.formData();
  const id = String(formData.get('id') ?? '').trim() || null;
  const input = parseAdminPostForm(formData);

  if (!input.title || !input.excerpt || !input.content || !input.category_id || !input.author_id) {
    return NextResponse.redirect(new URL('/admin/posts?error=missing_fields', request.url));
  }

  const coverFile = formData.get('cover_image_file');

  if (coverFile instanceof File && coverFile.size > 0) {
    const uploaded = await uploadAdminCoverImage(coverFile, input.slug, input.title);
    input.cover_image_url = uploaded.publicUrl;
  }

  try {
    const saved = await saveAdminPost(id, input);
    return NextResponse.redirect(new URL(`/admin/posts/${saved.id}/edit?saved=1`, request.url));
  } catch (error) {
    console.error('Admin post save error:', error);
    return NextResponse.redirect(new URL('/admin/posts?error=save_failed', request.url));
  }
}
