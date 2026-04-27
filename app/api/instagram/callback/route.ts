import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { exchangeCodeForToken, getLongLivedToken } from '@/lib/instagram';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error_description') || url.searchParams.get('error');

  const cookieStore = await cookies();
  const expectedState = cookieStore.get('ig_oauth_state')?.value;

  if (error) {
    return NextResponse.redirect(new URL(`/?ig_error=${encodeURIComponent(error)}`, url.origin));
  }
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL('/?ig_error=invalid_state', url.origin));
  }

  cookieStore.delete('ig_oauth_state');

  try {
    const { accessToken: shortToken, userId } = await exchangeCodeForToken(code);
    const longToken = await getLongLivedToken(shortToken);

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 50,
    };

    cookieStore.set('ig_user_id', userId, cookieOpts);
    cookieStore.set('ig_access_token', longToken, cookieOpts);

    return NextResponse.redirect(new URL('/?ig_connected=1', url.origin));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return NextResponse.redirect(new URL(`/?ig_error=${encodeURIComponent(msg)}`, url.origin));
  }
}
