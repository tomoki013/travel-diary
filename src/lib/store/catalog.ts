export type StoreProduct = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  priceLabel: string;
  checkoutUrl?: string;
  features: string[];
  idealFor: string;
  delivery: string;
};

const normalizeCheckoutUrl = (value: string | undefined) => {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
};

export const STORE_SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_STORE_SUPPORT_EMAIL?.trim() || "";

export const STORE_LEGAL_URL =
  process.env.NEXT_PUBLIC_STORE_LEGAL_URL?.trim() || "/terms";

export const storeProducts: StoreProduct[] = [
  {
    slug: "trip-sheet",
    name: "Trip Sheet",
    eyebrow: "旅程を、見返しやすい一枚に",
    description:
      "Markdownで書いた旅程を、日ごとのタイムラインとして整えて表示できるローカル旅程ビューアです。ログイン不要で、旅行データは端末の中だけで扱えます。",
    priceLabel: "¥980",
    checkoutUrl: normalizeCheckoutUrl(
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_TRIP_SHEET_URL,
    ),
    features: [
      "複数旅行を切り替えて管理",
      "日ごとのタイムライン表示",
      "Markdownベースで自由に編集",
      "ローカル動作・ログイン不要",
      "サンプル旅程と書き方ガイド付き",
    ],
    idealFor:
      "長期旅行や周遊旅行で、予約情報・移動・予定を一か所に整理したい人",
    delivery: "購入後すぐにダウンロード",
  },
];

export const getStoreProduct = (slug: string) =>
  storeProducts.find((product) => product.slug === slug);
