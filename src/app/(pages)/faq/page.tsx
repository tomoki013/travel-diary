import { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import FaqClient from "@/components/pages/faq/FaqClient";

// Existing FAQs from the old page, with added metadata for the new UI
const FAQS = [
  {
    question: "このサイトについて",
    answer:
      "このサイトは旅行ブログとして、様々な観光地を紹介しています。また、AIが旅行プランを作成する「AIトラベルプランナー」も搭載しています。",
    category: "site-info",
    tags: ["ブログ", "AI", "概要"],
  },
  {
    question: "おすすめの旅行先は？",
    answer:
      "このブログではヨーロッパ、アジア、アフリカなど、世界中の様々な国や地域の旅行記を掲載しています。「デスティネーション」ページから、興味のある国を探してみてください。きっとあなたにぴったりの旅行先が見つかります。",
    category: "destinations",
    tags: ["海外", "旅行先", "おすすめ"],
  },
  {
    question: "旅行の予算はどれくらい必要ですか？",
    answer:
      "予算は旅行先の物価、滞在期間、旅行のスタイル（バックパッカー、豪華旅行など）によって大きく異なります。各旅行記には、かかった費用を参考に記載している場合もありますので、ぜひご覧ください。AI旅行プランナーも予算に応じたプランを作成できます。",
    category: "preparation",
    tags: ["予算", "費用", "AI"],
  },
  {
    question: "海外旅行で気をつけるべきことは？",
    answer:
      "安全が第一です。外務省の海外安全情報を確認し、危険な地域には近づかないようにしましょう。また、スリや置き引きなどの軽犯罪にも注意が必要です。現地の文化や習慣を尊重することも大切です。",
    category: "preparation",
    tags: ["安全", "治安", "注意点"],
  },
  {
    question: "ブログに掲載されている写真は自由に使っていいですか？",
    answer:
      "サイト内のすべてのコンテンツ（文章、写真など）の著作権は当サイトの管理者に帰属します。無断転載・使用は固くお断りします。",
    category: "site-info",
    tags: ["著作権", "写真", "ルール"],
  },
  {
    question: "このサイトで航空券やホテルの予約はできますか？",
    answer:
      "現在、予約サービスは提供しておりません。旅の計画に役立つ情報や旅行プランを提供しています。",
    category: "hotels",
    tags: ["予約", "ホテル", "航空券"],
  },
  {
    question: "ブログの更新頻度は？",
    answer:
      "不定期ですが、新しい旅行体験や役立つ情報を随時更新していきます。SNSで更新情報をお知らせしていますので、ぜひフォローしてください。",
    category: "site-info",
    tags: ["更新", "SNS"],
  },
  {
    question: "掲載されている情報が古い場合はどうすればいいですか？",
    answer:
      "情報の正確性には万全を期していますが、万が一古い情報を見つけた場合は、お問い合わせフォームからご連絡いただけると幸いです。",
    category: "site-info",
    tags: ["情報", "連絡"],
  },
  {
    question: "AIトラベルプランナーは無料ですか？",
    answer: "はい、完全に無料でご利用いただけます。",
    category: "site-info",
    tags: ["AI", "無料", "ツール"],
  },
  {
    question: "AIトラベルプランナーの使い方",
    answer:
      "メインメニューから「AIトラベルプランナー」にアクセスし、目的地、期間、興味などを入力すると、AIがあなただけの旅行プランを生成します。",
    category: "site-info",
    tags: ["AI", "使い方", "ツール"],
  },
  {
    question: "AIが生成する旅行プランは信頼できますか？",
    answer:
      "AIが生成する旅行プランは膨大なデータに基づいており、役立つように設計されていますが、あくまで参考として、ご自身のニーズに合わせて調整することをおすすめします。",
    category: "site-info",
    tags: ["AI", "信頼性"],
  },
  {
    question: "AI旅行プランナーはどのような情報に基づいてプランを作成しますか？",
    answer:
      "このブログに掲載されている旅行記の情報を主な知識ベースとしています。そのため、私が実際に訪れた場所や経験に基づいた、より実践的な提案が可能です。",
    category: "site-info",
    tags: ["AI", "データ"],
  },
  {
    question: "プランの結果が期待と違う場合はどうすればいいですか？",
    answer:
      "AIへの指示（興味・関心など）をより具体的にすることで、結果が改善されることがあります。例えば、「美味しいものが食べたい」だけでなく「シーフードが美味しいレストランに行きたい」のように入力してみてください。何度か試すことで、より理想に近いプランが作成できます。",
    category: "site-info",
    tags: ["AI", "コツ"],
  },
  {
    question: "生成されたプランを保存・共有できますか？",
    answer:
      "はい、プラン生成後に表示される「このプランを共有する」ボタンをクリックすると、プランが保存された特別なURLが生成されます。そのURLをコピーして、後から見返したり、友人と共有したりすることができます。",
    category: "site-info",
    tags: ["AI", "共有", "保存"],
  },
];

export const metadata: Metadata = {
  title: "FAQ | Tomokichi Diary",
  description: "Tomokichi Diaryに関するよくある質問と回答を掲載しています。",
  alternates: {
    canonical: new URL("/faq", "https://tomokichidiary.netlify.app"),
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
