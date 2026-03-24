import { NextResponse } from 'next/server';
import { getAdminLoginPath } from '@/lib/admin-path';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL(getAdminLoginPath(), request.url));
  response.cookies.set('victor_admin_session', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
