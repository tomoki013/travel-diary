import { Post, RevenueCategory, TravelTopic } from "@/types/types";

type PostMetadata = Omit<Post, "content">;
type RevenueInferenceSource = Pick<
  Post,
  "title" | "excerpt" | "category" | "tags" | "travelTopics" | "revenueCategory"
>;

const HIGH_INTENT: TravelTopic[] = [
  "money",
  "visa",
  "transport",
  "booking",
  "sim",
  "insurance",
];

const PRACTICAL_TOPICS: TravelTopic[] = [
  "money",
  "visa",
  "transport",
  "booking",
  "sim",
  "insurance",
];

const KEYWORDS: Record<RevenueCategory, string[]> = {
  money: ["両替", "クレカ", "カード", "alipay", "wechat", "currency", "exchange", "支払い", "決済", "現金"],
  visa: ["visa", "ビザ", "e-visa", "入国", "申請"],
  transport: ["鉄道", "train", "空港", "アクセス", "バス", "交通", "metro", "subway", "地下鉄", "列車", "移動", "transit"],
  booking: ["予約", "booking", "hotel", "flight", "航空券", "omio", "agoda", "trip.com", "チケット", "ツアー"],
  sim: ["sim", "esim", "wifi", "通信"],
  insurance: ["保険", "insurance"],
  guide: ["観光", "ガイド", "おすすめ", "how", "tips"],
  essay: [],
};

const dedupeTopics = (topics: TravelTopic[]) => [...new Set(topics)];

const normalizeTravelTopics = (topics?: TravelTopic[]) =>
  dedupeTopics(
    (topics || []).filter((topic): topic is TravelTopic =>
      PRACTICAL_TOPICS.includes(topic),
    ),
  );

export const inferRevenueCategory = (
  post: RevenueInferenceSource,
): RevenueCategory => {
  const corpus = [post.title, post.excerpt, post.category, ...(post.tags || [])]
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

export const inferTravelTopics = (post: RevenueInferenceSource): TravelTopic[] => {
  if (post.category !== "tourism") {
    return [];
  }

  return normalizeTravelTopics(post.travelTopics);
};

export const enrichPostRevenueCategory = <T extends {
  title: string;
  excerpt?: string;
  category: string;
  tags?: string[];
  revenueCategory?: RevenueCategory;
  travelTopics?: TravelTopic[];
}>(post: T): T & { revenueCategory: RevenueCategory; travelTopics: TravelTopic[] } => ({
  ...post,
  revenueCategory: post.revenueCategory || inferRevenueCategory(post),
  travelTopics: inferTravelTopics(post),
});

export const getHighIntentPosts = (posts: PostMetadata[]) =>
  posts.filter(
    (post) => post.category === "tourism" && (post.travelTopics?.length || 0) > 0,
  );

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
  const currentTopics = new Set(normalizeTravelTopics(current.travelTopics));
  const currentLocations = new Set(
    (current.location || []).map((location) => location.toLowerCase())
  );

  return allPosts
    .filter(
      (post) => post.slug !== current.slug && (post.revenueCategory || "guide") !== "essay",
    )
    .map((post) => {
      const postCategory = post.revenueCategory || "guide";
      const categoryIndex = order.indexOf(postCategory);
      if (categoryIndex === -1) {
        return null;
      }

      const locationMatches = (post.location || []).filter((location) =>
        currentLocations.has(location.toLowerCase())
      ).length;
      const sharedTopics = normalizeTravelTopics(post.travelTopics).filter((topic) =>
        currentTopics.has(topic)
      ).length;
      const sameSeries = Boolean(current.series && post.series === current.series);
      const sameJourney = Boolean(current.journey && post.journey === current.journey);
      const hasStrongContextMatch = sameJourney || locationMatches > 0;

      if (!hasStrongContextMatch) {
        return null;
      }

      let score = 0;
      score += (order.length - categoryIndex) * 12;
      score += sameJourney ? 30 : 0;
      score += sameSeries ? 8 : 0;
      score += locationMatches * 22;
      score += sharedTopics * 12;
      score += post.category === "tourism" ? 6 : 0;

      if (score < 40) {
        return null;
      }

      const recency = new Date(post.dates?.[0] || "1970-01-01").getTime();

      return { post, score, recency };
    })
    .filter((item): item is { post: PostMetadata; score: number; recency: number } => Boolean(item))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.recency - a.recency;
    })
    .slice(0, 3)
    .map(({ post }) => post);
};

export const HIGH_INTENT_CATEGORIES = HIGH_INTENT;
