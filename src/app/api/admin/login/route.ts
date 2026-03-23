import { NextResponse } from 'next/server';
import {
  buildAdminCookieOptions,
  createAdminSessionToken,
  validateAdminPassword,
} from '@/lib/admin';

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get('password') ?? '');

  if (!validateAdminPassword(password)) {
    return NextResponse.redirect(new URL('/admin/login?error=1', request.url));
  }

  const response = NextResponse.redirect(new URL('/admin/posts', request.url));
  response.cookies.set('victor_admin_session', createAdminSessionToken(), buildAdminCookieOptions());
  return response;
}
