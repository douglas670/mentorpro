import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { decodeSession, SESSION_CONFIG, type SessionUser } from '@/lib/auth';

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_CONFIG.cookieName)?.value;
  return decodeSession(token);
}

export async function getCurrentUser() {
  const session = await getSessionUser();
  if (!session) return null;
  return prisma.user.findUnique({ where: { email: session.email } });
}
