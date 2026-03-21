import { PostType, TravelTopic } from "@/types/types";

type FilterOption<T extends string> = {
  slug: T | "all";
  title: string;
};

export const articleCategories: FilterOption<PostType>[] = [
  { slug: "all", title: "すべてのカテゴリー" },
  { slug: "tourism", title: "観光情報" },
  { slug: "itinerary", title: "旅程&費用レポート" },
  { slug: "series", title: "シリーズ" },
  { slug: "one-off", title: "単発企画" },
];

export const travelTopicOptions: FilterOption<TravelTopic>[] = [
  { slug: "all", title: "すべてのラベル" },
  { slug: "money", title: "お金・決済" },
  { slug: "visa", title: "ビザ" },
  { slug: "transport", title: "交通" },
  { slug: "booking", title: "予約" },
  { slug: "sim", title: "通信" },
  { slug: "insurance", title: "保険" },
];

export const categoryTitleMap: Record<PostType, string> = {
  tourism: "観光情報",
  itinerary: "旅程&費用レポート",
  series: "シリーズ",
  "one-off": "単発企画",
};

export const travelTopicTitleMap: Record<TravelTopic, string> = {
  money: "お金・決済",
  visa: "ビザ",
  transport: "交通",
  booking: "予約",
  sim: "通信",
  insurance: "保険",
};

export const getCategoryTitle = (slug?: string) => {
  if (!slug) return undefined;
  return categoryTitleMap[slug as PostType];
};

export const getTravelTopicTitle = (slug?: string) => {
  if (!slug) return undefined;
  return travelTopicTitleMap[slug as TravelTopic];
};
