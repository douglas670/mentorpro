import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decodeSession, SESSION_CONFIG } from '@/lib/auth';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_CONFIG.cookieName)?.value;
  const user = decodeSession(token);

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user });
}
