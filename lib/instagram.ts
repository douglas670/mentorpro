const GRAPH_VERSION = 'v21.0';
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;
const FB_OAUTH_BASE = `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth`;

export const SCOPES = [
  'pages_show_list',
  'pages_read_engagement',
  'business_management',
  'instagram_basic',
].join(',');

export function buildAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: process.env.META_REDIRECT_URI!,
    state,
    scope: SCOPES,
    response_type: 'code',
  });
  return `${FB_OAUTH_BASE}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    redirect_uri: process.env.META_REDIRECT_URI!,
    code,
  });
  const res = await fetch(`${GRAPH_BASE}/oauth/access_token?${params.toString()}`);
  if (!res.ok) throw new Error(`token exchange failed: ${await res.text()}`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export async function getLongLivedToken(shortToken: string): Promise<string> {
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    fb_exchange_token: shortToken,
  });
  const res = await fetch(`${GRAPH_BASE}/oauth/access_token?${params.toString()}`);
  if (!res.ok) throw new Error(`long-lived exchange failed: ${await res.text()}`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

type Page = {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: { id: string };
};

export async function findInstagramAccount(userToken: string): Promise<{
  igUserId: string;
  pageAccessToken: string;
  pageName: string;
} | null> {
  const res = await fetch(
    `${GRAPH_BASE}/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${userToken}`
  );
  if (!res.ok) throw new Error(`me/accounts failed: ${await res.text()}`);
  const json = (await res.json()) as { data: Page[] };
  const page = json.data.find(p => p.instagram_business_account?.id);
  if (!page || !page.instagram_business_account) return null;
  return {
    igUserId: page.instagram_business_account.id,
    pageAccessToken: page.access_token,
    pageName: page.name,
  };
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
};

export async function getProfile(igUserId: string, token: string): Promise<InstagramProfile> {
  const fields = 'id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url';
  const res = await fetch(`${GRAPH_BASE}/${igUserId}?fields=${fields}&access_token=${token}`);
  if (!res.ok) throw new Error(`getProfile failed: ${await res.text()}`);
  return (await res.json()) as InstagramProfile;
}

export type AccountInsights = {
  reach: number;
  impressions: number;
  profile_views: number;
};

export async function getAccountInsights(igUserId: string, token: string): Promise<AccountInsights> {
  const metrics = 'reach,impressions,profile_views';
  const res = await fetch(
    `${GRAPH_BASE}/${igUserId}/insights?metric=${metrics}&period=days_28&access_token=${token}`
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

export async function getTopPosts(igUserId: string, token: string, limit = 3): Promise<TopPost[]> {
  const fields = 'id,caption,permalink,thumbnail_url,media_url,media_type,timestamp,like_count,comments_count';
  const res = await fetch(
    `${GRAPH_BASE}/${igUserId}/media?fields=${fields}&limit=25&access_token=${token}`
  );
  if (!res.ok) throw new Error(`getTopPosts failed: ${await res.text()}`);
  const json = (await res.json()) as { data: TopPost[] };
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return json.data
    .filter(p => new Date(p.timestamp).getTime() >= oneWeekAgo)
    .sort((a, b) => (b.like_count + b.comments_count) - (a.like_count + a.comments_count))
    .slice(0, limit);
}
