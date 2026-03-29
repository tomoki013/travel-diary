import { Metadata } from "next";
import { getAllPosts } from "@/lib/post-metadata";
import FaqClient from "@/components/pages/faq/FaqClient";
import { PRIMARY_SITE_URL } from "@/constants/site";
import { FAQS } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ | ともきちの旅行日記",
  description:
    "記事の探し方、旅行記と実用記事の違い、Gallery や補助機能の使い方など、ともきちの旅行日記に関するよくある質問をまとめています。",
  alternates: {
    canonical: new URL("/faq", PRIMARY_SITE_URL),
  },
};

export default async function FaqPage() {
  const allPosts = await getAllPosts();

  // --- Calculate Content Distribution (Pie Chart) ---
  const categoryCounts: Record<string, number> = {};
  allPosts.forEach((post) => {
    // Map existing categories to user-friendly labels
    let label = "その他";
    if (post.category === "tourism") label = "観光ガイド";
    else if (post.category === "itinerary") label = "モデルコース";
    else if (post.category === "series") label = "旅行記シリーズ";
    else if (post.category === "one-off") label = "単発記事";

    categoryCounts[label] = (categoryCounts[label] || 0) + 1;
  });

  const distributionData = Object.entries(categoryCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // --- Calculate Planning Timeline (Bar Chart) ---
  // Heuristic mapping based on categories/content
  const phaseCounts = {
    "検討段階": 0,
    "予約・手配": 0,
    "出発直前": 0,
    "旅行中": 0,
    "帰国後": 0,
  };

  allPosts.forEach((post) => {
    // Determine phase based on category/tags
    if (post.category === "itinerary") {
      phaseCounts["検討段階"] += 1; // Models for planning
    } else if (
      post.tags?.includes("準備") ||
      post.tags?.includes("マイル") ||
      post.tags?.includes("ホテル")
    ) {
      phaseCounts["予約・手配"] += 1;
    } else if (post.tags?.includes("持ち物") || post.tags?.includes("空港")) {
      phaseCounts["出発直前"] += 1;
    } else if (post.category === "tourism") {
      phaseCounts["旅行中"] += 1; // Sightseeing info
    } else if (post.category === "series") {
      phaseCounts["帰国後"] += 1; // Reading travelogues
    } else {
      phaseCounts["検討段階"] += 1; // Default fallback
    }
  });

  const phaseTips = {
    "検討段階": "「モデルコース」や「旅行記」で行き先イメージを膨らませる",
    "予約・手配": "「準備」タグやホテル情報でお得に予約",
    "出発直前": "パッキングや空港アクセス情報を確認",
    "旅行中": "現地の観光スポット情報を活用",
    "帰国後": "自分の体験と重ねて旅行記を楽しむ",
  };

  const phaseData = Object.entries(phaseCounts).map(([name, value]) => ({
    name,
    value: value || 1, // Avoid 0 for better visual
    tips: phaseTips[name as keyof typeof phaseTips],
  }));

  return (
    <FaqClient
      distributionData={distributionData}
      phaseData={phaseData}
      faqs={FAQS}
    />
  );
}
