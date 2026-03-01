import { Post, RevenueCategory } from "@/types/types";

type PostMetadata = Omit<Post, "content">;

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

export const inferRevenueCategory = (post: PostMetadata): RevenueCategory => {
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

export const enrichPostRevenueCategory = (post: PostMetadata): PostMetadata => ({
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
  return allPosts
    .filter((p) => p.slug !== current.slug)
    .sort((a, b) => {
      const ai = order.indexOf(a.revenueCategory || "guide");
      const bi = order.indexOf(b.revenueCategory || "guide");
      if (ai === bi) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    })
    .slice(0, 3);
};

export const HIGH_INTENT_CATEGORIES = HIGH_INTENT;
