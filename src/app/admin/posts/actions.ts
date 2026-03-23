'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { removeAdminPost, requireAdmin } from '@/lib/admin';

export async function deleteAdminPostAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get('id') ?? '').trim();
  if (!id) {
    redirect('/admin/posts?error=missing_id');
  }

  try {
    await removeAdminPost(id);
    revalidatePath('/admin/posts');
    redirect('/admin/posts?deleted=1');
  } catch (error) {
    console.error('Admin post delete error:', error);
    redirect('/admin/posts?error=delete_failed');
  }
}
