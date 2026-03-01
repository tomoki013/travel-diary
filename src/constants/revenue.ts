import { RevenueCategory } from "@/types/types";

export type CtaItem = {
  title: string;
  description: string;
  serviceName: string;
  comparePoints: string[];
  buttonText: string;
  href: string;
  eventName: string;
};

export const CATEGORY_LABELS: Record<RevenueCategory, string> = {
  money: "お金・決済",
  visa: "ビザ",
  transport: "交通",
  booking: "予約",
  sim: "通信",
  insurance: "保険",
  guide: "ガイド",
  essay: "エッセイ",
};

export const CTA_BY_CATEGORY: Record<RevenueCategory, CtaItem[]> = {
  booking: [{ title: "ホテル・航空券を比較して予約", description: "価格、キャンセル条件、口コミを見比べて失敗を防げます。", serviceName: "Booking/Trip.com", comparePoints: ["最安値", "キャンセル可否", "口コミ"], buttonText: "予約サイトを確認", href: "/affiliates", eventName: "cta_booking_click" }],
  transport: [{ title: "移動手段を先に確保", description: "鉄道・バス・空港アクセスの比較を先に済ませると旅程が安定します。", serviceName: "Omio", comparePoints: ["所要時間", "料金", "乗換回数"], buttonText: "交通比較を見る", href: "/posts/omio-reservation", eventName: "cta_transport_click" }],
  visa: [{ title: "ビザ要件を再確認", description: "渡航前に申請期限と必要書類を確認しましょう。", serviceName: "ビザガイド", comparePoints: ["申請期限", "必要書類", "入国条件"], buttonText: "ビザ記事を読む", href: "/posts/india-visa", eventName: "cta_visa_click" }],
  money: [{ title: "現地決済の最適化", description: "現金・カード・アプリの使い分けで手数料を抑えます。", serviceName: "決済ガイド", comparePoints: ["手数料", "対応店舗", "使いやすさ"], buttonText: "決済記事を見る", href: "/posts/china-alipay-useful", eventName: "cta_money_click" }],
  sim: [{ title: "通信手段を選ぶ", description: "eSIMとWi-Fiの違いを理解して到着後の不安を減らしましょう。", serviceName: "通信比較", comparePoints: ["価格", "対応国", "設定難易度"], buttonText: "通信情報を見る", href: "/affiliates", eventName: "cta_sim_click" }],
  insurance: [{ title: "旅行保険を比較", description: "補償範囲を確認して医療費リスクに備えます。", serviceName: "保険比較", comparePoints: ["補償範囲", "免責", "保険料"], buttonText: "保険候補を見る", href: "/affiliates", eventName: "cta_insurance_click" }],
  guide: [{ title: "旅の準備をチェック", description: "予約・移動・通信など、次の準備をまとめて確認できます。", serviceName: "準備ガイド", comparePoints: ["優先度", "必要日数", "コスト"], buttonText: "準備記事を見る", href: "/posts", eventName: "cta_guide_click" }],
  essay: [{ title: "実用記事もあわせてチェック", description: "旅行記とあわせて、準備に使える実用記事を確認しましょう。", serviceName: "実用記事一覧", comparePoints: ["出発前", "現地移動", "予約"], buttonText: "実用記事を探す", href: "/posts", eventName: "cta_essay_click" }],
};
