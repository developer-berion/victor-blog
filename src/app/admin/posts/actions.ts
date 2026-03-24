'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { removeAdminPost, requireAdmin } from '@/lib/admin';
import { getAdminPostsPath } from '@/lib/admin-path';

export async function deleteAdminPostAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get('id') ?? '').trim();
  if (!id) {
    redirect(`${getAdminPostsPath()}?error=missing_id`);
  }

  try {
    await removeAdminPost(id);
    revalidatePath('/admin/posts');
    redirect(`${getAdminPostsPath()}?deleted=1`);
  } catch (error) {
    console.error('Admin post delete error:', error);
    redirect(`${getAdminPostsPath()}?error=delete_failed`);
  }
}
