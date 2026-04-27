import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('ig_user_id');
  cookieStore.delete('ig_access_token');
  return NextResponse.json({ ok: true });
}
