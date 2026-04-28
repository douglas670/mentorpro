import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { exchangeGoogleCodeForUser, encodeSession, SESSION_CONFIG } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const baseUrl = `${url.protocol}//${url.host}`;

  const cookieStore = await cookies();
  const expectedState = cookieStore.get('mp_oauth_state')?.value;

  if (error) {
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(error)}`, baseUrl));
  }
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL('/?auth_error=invalid_state', baseUrl));
  }

  cookieStore.delete('mp_oauth_state');

  try {
    const user = await exchangeGoogleCodeForUser(code, baseUrl);

    await prisma.user.upsert({
      where: { email: user.email },
      update: { sub: user.sub, nome: user.name ?? undefined, avatar: user.picture ?? undefined },
      create: {
        sub: user.sub,
        email: user.email,
        nome: user.name ?? null,
        avatar: user.picture ?? null,
      },
    });

    const session = encodeSession(user);

    cookieStore.set(SESSION_CONFIG.cookieName, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_CONFIG.maxAge,
    });

    return NextResponse.redirect(new URL('/?logged_in=1', baseUrl));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(msg)}`, baseUrl));
  }
}
