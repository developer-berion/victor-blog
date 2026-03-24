import { NextResponse } from 'next/server';
import {
  buildAdminCookieOptions,
  createAdminSessionToken,
  validateAdminPassword,
} from '@/lib/admin';
import { getAdminLoginPath, getAdminPostsPath } from '@/lib/admin-path';

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get('password') ?? '');

  if (!validateAdminPassword(password)) {
    return NextResponse.redirect(new URL(`${getAdminLoginPath()}?error=1`, request.url));
  }

  const response = NextResponse.redirect(new URL(getAdminPostsPath(), request.url));
  response.cookies.set('victor_admin_session', createAdminSessionToken(), buildAdminCookieOptions());
  return response;
}
