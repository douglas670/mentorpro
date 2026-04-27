import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProfile, getAccountInsights, getTopPosts } from '@/lib/instagram';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('ig_access_token')?.value;

  if (!token) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  try {
    const [profile, insights, topPosts] = await Promise.all([
      getProfile(token),
      getAccountInsights(token),
      getTopPosts(token),
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
