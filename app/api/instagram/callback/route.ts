import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { exchangeCodeForToken, getLongLivedToken, findInstagramAccount } from '@/lib/instagram';

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
    const shortToken = await exchangeCodeForToken(code);
    const longToken = await getLongLivedToken(shortToken);
    const ig = await findInstagramAccount(longToken);

    if (!ig.ok) {
      const detail = ig.reason === 'no_pages'
        ? 'no_pages'
        : `pages_without_instagram:${ig.pages.map(p => p.name).join('|')}`;
      return NextResponse.redirect(new URL(`/?ig_error=${encodeURIComponent(detail)}`, url.origin));
    }

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 50,
    };

    cookieStore.set('ig_user_id', ig.igUserId, cookieOpts);
    cookieStore.set('ig_page_token', ig.pageAccessToken, cookieOpts);

    return NextResponse.redirect(new URL('/?ig_connected=1', url.origin));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return NextResponse.redirect(new URL(`/?ig_error=${encodeURIComponent(msg)}`, url.origin));
  }
}
