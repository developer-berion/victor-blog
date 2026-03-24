import { NextResponse } from 'next/server';
import {
  getAdminSession,
  parseAdminPostForm,
  saveAdminPost,
  uploadAdminCoverImage,
} from '@/lib/admin';
import { getAdminEditPostPath } from '@/lib/admin-path';

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const id = String(formData.get('id') ?? '').trim() || null;
  const input = parseAdminPostForm(formData);

  if (!input.title || !input.excerpt || !input.content || !input.category_id || !input.author_id) {
    return NextResponse.json(
      { ok: false, error: 'missing_fields' },
      { status: 400 },
    );
  }

  const coverFile = formData.get('cover_image_file');
  const socialImageFile = formData.get('social_image_file');

  if (coverFile instanceof File && coverFile.size > 0) {
    const uploaded = await uploadAdminCoverImage(coverFile, input.slug);
    input.cover_image_url = uploaded.publicUrl;
  }

  if (socialImageFile instanceof File && socialImageFile.size > 0) {
    const uploaded = await uploadAdminCoverImage(socialImageFile, input.slug);
    input.social_image_url = uploaded.publicUrl;
  }

  try {
    const saved = await saveAdminPost(id, input);
    return NextResponse.json({
      ok: true,
      redirectTo: `${getAdminEditPostPath(saved.id)}?saved=1`,
    });
  } catch (error) {
    console.error('Admin post save error:', error);
    return NextResponse.json(
      { ok: false, error: 'save_failed' },
      { status: 500 },
    );
  }
}
