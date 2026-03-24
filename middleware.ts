import { NextRequest, NextResponse } from 'next/server';

const ADMIN_INTERNAL_PREFIX = '/admin';
const BYPASS_PREFIXES = ['/api', '/_next', '/favicon.ico', '/robots.txt', '/sitemap.xml'];

function isBypassPath(pathname: string) {
  return BYPASS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isBypassPath(pathname)) {
    return NextResponse.next();
  }

  if (
    pathname === ADMIN_INTERNAL_PREFIX ||
    pathname.startsWith(`${ADMIN_INTERNAL_PREFIX}/`)
  ) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
