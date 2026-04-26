import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProfile, getAccountInsights, getTopPosts } from '@/lib/instagram';

export async function GET() {
  const cookieStore = await cookies();
  const igUserId = cookieStore.get('ig_user_id')?.value;
  const token = cookieStore.get('ig_page_token')?.value;

  if (!igUserId || !token) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  try {
    const [profile, insights, topPosts] = await Promise.all([
      getProfile(igUserId, token),
      getAccountInsights(igUserId, token),
      getTopPosts(igUserId, token),
    ]);

    const engagementRate =
      profile.followers_count > 0
        ? +(((insights.reach || 1) / profile.followers_count) * 100).toFixed(1)
        : 0;

    return NextResponse.json({
      connected: true,
      profile,
      insights,
      engagementRate,
      topPosts,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return NextResponse.json({ connected: false, error: msg }, { status: 500 });
  }
}
