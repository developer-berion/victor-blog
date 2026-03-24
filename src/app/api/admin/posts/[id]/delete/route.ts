import { NextResponse } from 'next/server';
import { removeAdminPost, requireAdmin } from '@/lib/admin';
import { getAdminPostsPath } from '@/lib/admin-path';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await context.params;

  try {
    await removeAdminPost(id);
    return NextResponse.redirect(new URL(`${getAdminPostsPath()}?deleted=1`, request.url));
  } catch (error) {
    console.error('Admin post delete error:', error);
    return NextResponse.redirect(new URL(`${getAdminPostsPath()}?error=delete_failed`, request.url));
  }
}
