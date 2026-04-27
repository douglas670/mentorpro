import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { buildGoogleAuthUrl } from '@/lib/auth';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const state = crypto.randomBytes(16).toString('hex');

  const cookieStore = await cookies();
  cookieStore.set('mp_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  });

  return NextResponse.redirect(buildGoogleAuthUrl(state, baseUrl));
}
