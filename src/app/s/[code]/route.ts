import { NextResponse } from 'next/server';
import { getPostByShareCode } from '@/lib/supabase';
import { getPostCanonicalUrl } from '@/lib/social-sharing';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ code: string }> | { code: string };
};

export async function GET(_request: Request, context: RouteContext) {
  const { code } = await context.params;
  const shareCode = String(code ?? '').trim();

  if (!shareCode) {
    return new NextResponse('Not found', {
      status: 404,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store',
      },
    });
  }

  try {
    const post = await getPostByShareCode(shareCode);
    const response = NextResponse.redirect(getPostCanonicalUrl(post.slug), 307);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    return new NextResponse('Not found', {
      status: 404,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store',
      },
    });
  }
}
