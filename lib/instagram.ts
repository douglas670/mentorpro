const GRAPH_VERSION = 'v21.0';
const IG_GRAPH_BASE = `https://graph.instagram.com/${GRAPH_VERSION}`;
const IG_OAUTH_BASE = 'https://www.instagram.com/oauth/authorize';
const IG_TOKEN_URL = 'https://api.instagram.com/oauth/access_token';
const IG_LONG_LIVED_URL = 'https://graph.instagram.com/access_token';

export const SCOPES = [
  'instagram_business_basic',
].join(',');

export function buildAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: process.env.META_REDIRECT_URI!,
    state,
    response_type: 'code',
    scope: SCOPES,
  });
  return `${IG_OAUTH_BASE}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<{ accessToken: string; userId: string }> {
  const body = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    grant_type: 'authorization_code',
    redirect_uri: process.env.META_REDIRECT_URI!,
    code,
  });
  const res = await fetch(IG_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`token exchange failed: ${await res.text()}`);
  const json = (await res.json()) as { access_token: string; user_id: number | string };
  return { accessToken: json.access_token, userId: String(json.user_id) };
}

export async function getLongLivedToken(shortToken: string): Promise<string> {
  const params = new URLSearchParams({
    grant_type: 'ig_exchange_token',
    client_secret: process.env.META_APP_SECRET!,
    access_token: shortToken,
  });
  const res = await fetch(`${IG_LONG_LIVED_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`long-lived exchange failed: ${await res.text()}`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export type InstagramProfile = {
  id: string;
  username: string;
  name?: string;
  biography?: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  profile_picture_url?: string;
  account_type?: string;
};

export async function getProfile(token: string): Promise<InstagramProfile> {
  const fields = 'id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,account_type';
  const res = await fetch(`${IG_GRAPH_BASE}/me?fields=${fields}&access_token=${token}`);
  if (!res.ok) throw new Error(`getProfile failed: ${await res.text()}`);
  return (await res.json()) as InstagramProfile;
}

export type AccountInsights = {
  reach: number;
  impressions: number;
  profile_views: number;
};

export async function getAccountInsights(token: string): Promise<AccountInsights> {
  const metrics = 'reach,impressions,profile_views';
  const res = await fetch(
    `${IG_GRAPH_BASE}/me/insights?metric=${metrics}&period=days_28&access_token=${token}`
  );
  if (!res.ok) {
    return { reach: 0, impressions: 0, profile_views: 0 };
  }
  type InsightItem = { name: string; values: { value: number }[] };
  const json = (await res.json()) as { data: InsightItem[] };
  const out: AccountInsights = { reach: 0, impressions: 0, profile_views: 0 };
  for (const item of json.data) {
    const v = item.values?.[0]?.value ?? 0;
    if (item.name === 'reach') out.reach = v;
    if (item.name === 'impressions') out.impressions = v;
    if (item.name === 'profile_views') out.profile_views = v;
  }
  return out;
}

export type TopPost = {
  id: string;
  caption?: string;
  permalink: string;
  thumbnail_url?: string;
  media_url?: string;
  media_type: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
};

export async function getTopPosts(token: string, limit = 3): Promise<TopPost[]> {
  const fields = 'id,caption,permalink,thumbnail_url,media_url,media_type,timestamp,like_count,comments_count';
  const res = await fetch(
    `${IG_GRAPH_BASE}/me/media?fields=${fields}&limit=25&access_token=${token}`
  );
  if (!res.ok) throw new Error(`getTopPosts failed: ${await res.text()}`);
  const json = (await res.json()) as { data: TopPost[] };
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return json.data
    .filter(p => new Date(p.timestamp).getTime() >= oneWeekAgo)
    .sort((a, b) => (b.like_count + b.comments_count) - (a.like_count + a.comments_count))
    .slice(0, limit);
}
