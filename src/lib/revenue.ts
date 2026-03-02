import { Post, RevenueCategory } from "@/types/types";

type PostMetadata = Omit<Post, "content">;
type RevenueInferenceSource = Pick<Post, "title" | "excerpt" | "category" | "tags"> & {
  revenueCategory?: RevenueCategory;
};

const HIGH_INTENT: RevenueCategory[] = [
  "money",
  "visa",
  "transport",
  "booking",
  "sim",
  "insurance",
];

const KEYWORDS: Record<RevenueCategory, string[]> = {
  money: ["両替", "クレカ", "カード", "alipay", "wechat", "currency", "exchange", "支払い"],
  visa: ["visa", "ビザ", "e-visa", "入国", "申請"],
  transport: ["鉄道", "train", "空港", "アクセス", "バス", "交通", "metro", "subway"],
  booking: ["予約", "booking", "hotel", "flight", "航空券", "omio", "agoda", "trip.com"],
  sim: ["sim", "esim", "wifi", "通信"],
  insurance: ["保険", "insurance"],
  guide: ["観光", "ガイド", "おすすめ", "how", "tips"],
  essay: [],
};

export const inferRevenueCategory = (post: RevenueInferenceSource): RevenueCategory => {
  const corpus = [
    post.title,
    post.excerpt,
    post.category,
    ...(post.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  for (const category of Object.keys(KEYWORDS) as RevenueCategory[]) {
    if (category === "essay") continue;
    if (KEYWORDS[category].some((kw) => corpus.includes(kw.toLowerCase()))) {
      return category;
    }
  }

  if (post.category === "itinerary" || post.category === "series") return "essay";
  return "guide";
};

export const enrichPostRevenueCategory = <T extends {
  title: string;
  excerpt?: string;
  category: string;
  tags?: string[];
  revenueCategory?: RevenueCategory;
}>(post: T): T & { revenueCategory: RevenueCategory } => ({
  ...post,
  revenueCategory: post.revenueCategory || inferRevenueCategory(post),
});

export const getHighIntentPosts = (posts: PostMetadata[]) =>
  posts.filter((post) => post.revenueCategory && HIGH_INTENT.includes(post.revenueCategory));

export const getNextActionPosts = (current: PostMetadata, allPosts: PostMetadata[]) => {
  const flow: Record<RevenueCategory, RevenueCategory[]> = {
    visa: ["booking", "insurance", "transport"],
    booking: ["transport", "sim", "insurance"],
    transport: ["money", "sim", "guide"],
    money: ["sim", "insurance", "guide"],
    sim: ["guide", "essay", "money"],
    insurance: ["booking", "transport", "guide"],
    guide: ["booking", "transport", "money"],
    essay: ["booking", "transport", "money"],
  };

  const order = flow[current.revenueCategory || "guide"];

  const currentTags = new Set((current.tags || []).map((tag) => tag.toLowerCase()));
  const currentLocations = new Set(
    (current.location || []).map((location) => location.toLowerCase())
  );

  return allPosts
    .filter((p) => p.slug !== current.slug)
    .map((post) => {
      const postCategory = post.revenueCategory || "guide";
      const categoryIndex = order.indexOf(postCategory);

      let score = 0;

      // 1) 次の準備として優先したいカテゴリの流れ
      score += categoryIndex === -1 ? -20 : (order.length - categoryIndex) * 12;

      // 2) 同じ地域・旅程の文脈を優先
      if (current.series && post.series === current.series) score += 30;
      if (current.journey && post.journey === current.journey) score += 24;

      const locationMatches = (post.location || []).filter((location) =>
        currentLocations.has(location.toLowerCase())
      ).length;
      score += locationMatches * 10;

      // 3) タグとカテゴリの関連性
      const tagMatches = (post.tags || []).filter((tag) =>
        currentTags.has(tag.toLowerCase())
      ).length;
      score += tagMatches * 8;

      if (post.category === current.category) score += 5;

      // 4) 同点時に新しい記事を少し優先
      const recency = new Date(post.dates?.[0] || "1970-01-01").getTime();

      return { post, score, recency };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.recency - a.recency;
    })
    .map(({ post }) => post)
    .slice(0, 3);
};

export const HIGH_INTENT_CATEGORIES = HIGH_INTENT;
