// /llms.txt — LLM 向けサイト概要ファイル（動的生成）
// https://llmstxt.org の仕様に準拠。
// ビルド時ではなくリクエスト時に生成するため、常に最新の記事一覧を反映する。

import { getAllPosts } from "@/lib/post-metadata";
import { PRIMARY_SITE_URL } from "@/constants/site";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  tourism: "観光・実用情報",
  itinerary: "旅程・費用まとめ",
  series: "旅行記シリーズ",
  "one-off": "エッセイ・コラム",
};

export async function GET() {
  const posts = await getAllPosts();

  // カテゴリ別にグループ化
  const grouped = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const cat = post.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(post);
    return acc;
  }, {});

  const categoryOrder = ["tourism", "itinerary", "series", "one-off"];

  const lines: string[] = [
    `# ともきちの旅行日記`,
    ``,
    `> 日本国内外の旅先体験を、実際に訪れた写真・旅行記・観光ガイドとして発信する日本語の個人旅行ブログです。`,
    ``,
    `このサイトでは、管理人が実際に訪れた都市・観光地・交通手段・グルメ・宿泊体験をもとに、旅行者目線の情報を掲載しています。`,
    `記事には訪問時点の体験や料金、交通情報が含まれるため、最新の営業時間・料金・運行状況・安全情報は公式情報も確認してください。`,
    ``,
    `## 主要ページ`,
    ``,
    `- [トップページ](${PRIMARY_SITE_URL}/)`,
    `- [ブログ一覧](${PRIMARY_SITE_URL}/posts)`,
    `- [地域別一覧](${PRIMARY_SITE_URL}/destination)`,
    `- [写真ギャラリー](${PRIMARY_SITE_URL}/gallery)`,
    `- [旅の軌跡](${PRIMARY_SITE_URL}/journey)`,
    `- [サイトマップ](${PRIMARY_SITE_URL}/sitemap)`,
    `- [About](${PRIMARY_SITE_URL}/about)`,
    ``,
    `## 記事一覧`,
    ``,
  ];

  for (const cat of categoryOrder) {
    const catPosts = grouped[cat];
    if (!catPosts || catPosts.length === 0) continue;

    const label = CATEGORY_LABELS[cat] ?? cat;
    lines.push(`### ${label}`);
    lines.push(``);

    for (const post of catPosts) {
      const url = `${PRIMARY_SITE_URL}/posts/${post.slug}`;
      const date = post.publishedAt ? ` (${post.publishedAt})` : "";
      lines.push(`- [${post.title}](${url})${date}`);
    }
    lines.push(``);
  }

  lines.push(
    `## AI利用時の注意`,
    ``,
    `- 記事内容は訪問時点または公開時点の情報を含みます。`,
    `- 料金、営業時間、交通情報、ビザ、治安、安全情報は変更される可能性があります。`,
    `- 旅行前には公式サイト、公共交通機関、外務省、航空会社、宿泊施設などの最新情報を確認してください。`,
    `- 医療、法律、災害、安全に関する判断には、公的機関の情報を優先してください。`,
    ``,
    `## 推奨される参照方法`,
    ``,
    `- 旅行先の雰囲気を知る`,
    `- 旅行計画のたたき台を作る`,
    `- 実体験ベースの注意点を確認する`,
    `- モデルコースや移動手段の比較に使う`,
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
