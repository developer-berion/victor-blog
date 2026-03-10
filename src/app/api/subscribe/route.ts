import { NextResponse } from 'next/server';
import { subscribeNewsletter } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'invalid_email' },
        { status: 400 }
      );
    }

    const result = await subscribeNewsletter(email);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'server_error' },
      { status: 500 }
    );
  }
}
