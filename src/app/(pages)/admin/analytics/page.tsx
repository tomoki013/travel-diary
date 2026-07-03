import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import snapshotJson from "@/data/analytics/snapshot.json";
import { analyticsWatchlist } from "@/data/analytics/watchlist";
import { getRawPostsData } from "@/lib/markdown";
import AnalyticsDashboard from "@/components/features/analytics/AnalyticsDashboard";
import type { AnalyticsSnapshot, AnalyticsPostInfo } from "@/types/analytics";

// 運営者用の内部ページ。検索エンジンにインデックスさせない。
export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

// データ更新の手順は docs/analytics-dashboard.md を参照。
// スナップショット (src/data/analytics/snapshot.json) は
// scripts/generate-analytics-snapshot.mjs の手動実行で更新する。
export default async function AdminAnalyticsPage() {
  // パスワード未設定の環境ではページごと存在しない扱いにする
  if (!process.env.ANALYTICS_PASSWORD) {
    notFound();
  }

  const cookieStore = await cookies();
  if (cookieStore.get("analytics_auth")?.value !== "true") {
    redirect("/admin/analytics/login");
  }

  // GSC/GA4 のパスに記事タイトル・カテゴリを紐付けるための対応表
  const postInfo: Record<string, AnalyticsPostInfo> = Object.fromEntries(
    getRawPostsData().map((post) => [
      `/posts/${post.slug}`,
      { title: post.title, category: post.category, noindex: post.noindex === true },
    ]),
  );

  return (
    <AnalyticsDashboard
      snapshot={snapshotJson as unknown as AnalyticsSnapshot}
      watchlist={analyticsWatchlist}
      postInfo={postInfo}
    />
  );
}
