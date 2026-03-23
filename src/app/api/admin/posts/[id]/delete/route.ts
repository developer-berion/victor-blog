import { NextResponse } from 'next/server';
import { removeAdminPost, requireAdmin } from '@/lib/admin';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await context.params;

  try {
    await removeAdminPost(id);
    return NextResponse.redirect(new URL('/admin/posts?deleted=1', request.url));
  } catch (error) {
    console.error('Admin post delete error:', error);
    return NextResponse.redirect(new URL('/admin/posts?error=delete_failed', request.url));
  }
}
