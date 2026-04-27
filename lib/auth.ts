import crypto from 'crypto';

export type SessionUser = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
};

const SESSION_COOKIE = 'mp_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

export function encodeSession(user: SessionUser): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET not set');
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS })).toString('base64url');
  const signature = sign(payload, secret);
  return `${payload}.${signature}`;
}

export function decodeSession(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload, secret);
  if (expected !== signature) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionUser & { exp: number };
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return null;
    const { exp: _exp, ...user } = data;
    void _exp;
    return user;
  } catch {
    return null;
  }
}

export const SESSION_CONFIG = {
  cookieName: SESSION_COOKIE,
  maxAge: SESSION_MAX_AGE_SECONDS,
};

export function buildGoogleAuthUrl(state: string, baseUrl: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('GOOGLE_CLIENT_ID not set');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/auth/callback/google`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCodeForUser(code: string, baseUrl: string): Promise<SessionUser> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Google OAuth credentials not configured');

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${baseUrl}/api/auth/callback/google`,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) throw new Error(`Google token exchange failed: ${await tokenRes.text()}`);
  const tokens = (await tokenRes.json()) as { access_token: string; id_token: string };

  const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!userRes.ok) throw new Error(`Google userinfo failed: ${await userRes.text()}`);

  const profile = (await userRes.json()) as { sub: string; email: string; name?: string; picture?: string };
  return {
    sub: profile.sub,
    email: profile.email,
    name: profile.name,
    picture: profile.picture,
  };
}
