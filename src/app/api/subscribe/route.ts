import { NextResponse } from 'next/server';
import { getLatestPublishedPosts, subscribeNewsletter } from '@/lib/supabase';
import { sendNewsletterWelcomeEmail } from '@/lib/newsletter-email';

export async function POST(request: Request) {
  try {
    const { email, locale } = await request.json();
    const normalizedLocale = locale === 'en' ? 'en' : 'es';

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'invalid_email' },
        { status: 400 }
      );
    }

    const result = await subscribeNewsletter(email, normalizedLocale);

    if (!result.success) {
      return NextResponse.json(result);
    }

    const latestPosts = await getLatestPublishedPosts(normalizedLocale, 3).catch(() => []);

    try {
      const emailResult = await sendNewsletterWelcomeEmail({
        to: email,
        locale: normalizedLocale,
        posts: latestPosts,
      });

      return NextResponse.json({
        ...result,
        email_sent: emailResult.sent,
      });
    } catch (emailError) {
      console.error('Newsletter email delivery error:', emailError);
      return NextResponse.json({
        ...result,
        email_sent: false,
      });
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'server_error' },
      { status: 500 }
    );
  }
}
