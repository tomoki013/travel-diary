import Link from "next/link";
import { Metadata } from "next";
import {
  BedDouble,
  CheckCircle2,
  Clock,
  Plane,
  Ticket,
  Train,
  Wifi,
} from "lucide-react";
import AffiliateCard from "@/components/common/AffiliateCard";
import { affiliates } from "@/constants/affiliates";

export const metadata: Metadata = {
  title: "Travel Essentials | 旅行予約・準備ガイド",
  description:
    "航空券、ホテル、現地ツアー、移動、通信など、旅行前に確認したい予約・準備の導線をまとめたページです。",
};

const travelEssentialCategories = [
  {
    slug: "all",
    label: "すべて",
    title: "旅行前に確認したい予約・準備",
    description:
      "航空券、宿、現地ツアー、移動、通信をまとめて確認できます。まずは旅程の中で外すと困るものから押さえるのがおすすめです。",
    icon: CheckCircle2,
    points: [
      "日程が固定される予約から先に決める",
      "キャンセル条件を必ず確認する",
      "現地で困る移動と通信を早めに用意する",
    ],
  },
  {
    slug: "flight",
    label: "航空券",
    title: "航空券を比較する",
    description:
      "価格だけでなく、乗継時間、到着時刻、預け荷物、キャンセル条件まで見て選ぶと失敗しにくくなります。",
    icon: Plane,
    points: [
      "到着が深夜にならないか確認する",
      "預け荷物込みの総額で比較する",
      "乗継時間に余裕を持たせる",
    ],
  },
  {
    slug: "hotel",
    label: "ホテル",
    title: "宿泊先を選ぶ",
    description:
      "立地、口コミ、キャンセル可否を優先して確認します。初めての都市では駅や空港アクセスの良さも重要です。",
    icon: BedDouble,
    points: [
      "観光地より移動拠点への近さを見る",
      "無料キャンセル期限を確認する",
      "深夜到着時のチェックイン条件を見る",
    ],
  },
  {
    slug: "activity",
    label: "ツアー",
    title: "現地ツアー・チケットを探す",
    description:
      "人気施設、日帰りツアー、空港送迎などは事前予約で当日の迷いを減らせます。",
    icon: Ticket,
    points: [
      "売り切れやすい施設は先に予約する",
      "集合場所と開始時刻を確認する",
      "日本語対応の有無を見る",
    ],
  },
  {
    slug: "transport",
    label: "移動",
    title: "鉄道・バス・空港アクセスを押さえる",
    description:
      "都市間移動や空港アクセスは、旅程全体の安定感に直結します。所要時間と乗換回数を先に確認します。",
    icon: Train,
    points: [
      "移動時間を詰め込みすぎない",
      "チケット受取方法を確認する",
      "早朝・深夜便の代替手段を用意する",
    ],
  },
  {
    slug: "esim",
    label: "通信・eSIM",
    title: "現地通信を準備する",
    description:
      "到着直後に地図や配車アプリを使えるよう、eSIMやWi-Fiの準備方針を先に決めておきます。",
    icon: Wifi,
    points: [
      "対応国と利用日数を確認する",
      "設定方法を出発前に見ておく",
      "同行者と通信手段を分散する",
    ],
  },
] as const;

type TravelEssentialCategory =
  (typeof travelEssentialCategories)[number]["slug"];

type SearchParams = {
  category?: string | string[];
};

const categorySlugs = travelEssentialCategories.map((category) => category.slug);

const normalizeCategory = (
  value: string | string[] | undefined,
): TravelEssentialCategory => {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (categorySlugs.includes(rawValue as TravelEssentialCategory)) {
    return rawValue as TravelEssentialCategory;
  }

  return "all";
};

const getCategoryHref = (category: TravelEssentialCategory) =>
  category === "all"
    ? "/travel-essentials"
    : `/travel-essentials?category=${category}`;

const TravelEssentialsPage = async (props: {
  searchParams: Promise<SearchParams>;
}) => {
  const searchParams = await props.searchParams;
  const activeCategory = normalizeCategory(searchParams.category);
  const selectedCategory =
    travelEssentialCategories.find(
      (category) => category.slug === activeCategory,
    ) ??
    travelEssentialCategories[0];
  const SelectedIcon = selectedCategory.icon;

  const readyAffiliates = affiliates.filter((affiliate) => {
    if (affiliate.status !== "ready") return false;
    if (activeCategory === "all") return true;
    return affiliate.categories?.includes(activeCategory);
  });

  const showAffiliateCards = readyAffiliates.length > 0;

  return (
    <main className="min-h-screen bg-stone-50/60 text-stone-900 dark:bg-[#080808] dark:text-stone-100">
      <section className="relative overflow-hidden border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-amber-100/70 to-transparent dark:from-amber-950/20" />
        <div className="container relative mx-auto px-6 py-20 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              Travel Essentials
            </span>
            <div className="space-y-4">
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                旅の予約と準備を、出発前に整える
              </h1>
              <p className="text-base leading-8 text-stone-600 dark:text-stone-400 sm:text-lg">
                航空券、ホテル、ツアー、移動、通信など、旅の前に決めておきたい項目をまとめました。
                実際に掲載準備ができている予約サービスと、予約前に見ておきたいチェックポイントをカテゴリ別に整理しています。
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-14 sm:px-8 lg:px-12">
        <nav
          aria-label="Travel essentials categories"
          className="flex gap-3 overflow-x-auto rounded-2xl border border-stone-200 bg-white p-3 shadow-sm dark:border-stone-800 dark:bg-stone-950"
        >
          {travelEssentialCategories.map((category) => {
            const isActive = category.slug === activeCategory;

            return (
              <Link
                key={category.slug}
                href={getCategoryHref(category.slug)}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-stone-100"
                }`}
              >
                {category.label}
              </Link>
            );
          })}
        </nav>

        <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-stone-950 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <SelectedIcon className="h-7 w-7" />
              </div>
              <div className="space-y-5">
                <div className="space-y-3">
                  <h2 className="font-heading text-3xl font-bold">
                    {selectedCategory.title}
                  </h2>
                  <p className="leading-8 text-stone-600 dark:text-stone-400">
                    {selectedCategory.description}
                  </p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-3">
                  {selectedCategory.points.map((point) => (
                    <li
                      key={point}
                      className="rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600 dark:bg-stone-900/60 dark:text-stone-300"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 dark:border-amber-900/60 dark:bg-amber-950/20">
            <div className="flex items-center gap-3 text-amber-700 dark:text-amber-300">
              <Clock className="h-5 w-5" />
              <h2 className="text-sm font-bold uppercase tracking-[0.2em]">
                Booking Guide
              </h2>
            </div>
            <p className="mt-5 text-sm leading-7 text-stone-600 dark:text-stone-400">
              掲載サービスは ready のものだけに絞っています。未準備のサービスやリンク未設定の候補は表示しません。
              予約前には料金だけでなく、キャンセル条件、受取方法、現地での使いやすさも確認してください。
            </p>
            <Link
              href="/affiliates"
              className="mt-6 inline-flex text-sm font-bold text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
            >
              アフィリエイトポリシーを見る
            </Link>
          </aside>
        </section>

        {showAffiliateCards ? (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold">
              おすすめの予約サービス
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {readyAffiliates.map((affiliate) => (
                <div
                  key={affiliate.name}
                  className={affiliate.type === "banner" ? "lg:col-span-3" : ""}
                >
                  <AffiliateCard affiliate={affiliate} type={affiliate.type} />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-12 rounded-[2rem] border border-stone-200 bg-white p-8 dark:border-stone-800 dark:bg-stone-950">
            <h2 className="font-heading text-2xl font-bold">
              予約サービス掲載は準備中です
            </h2>
            <p className="mt-4 max-w-3xl leading-8 text-stone-600 dark:text-stone-400">
              このカテゴリでは、現在掲載できる ready 状態の予約サービスがありません。
              予約前の判断材料として、上のチェックポイントを確認してください。
            </p>
          </section>
        )}

      </div>
    </main>
  );
};

export default TravelEssentialsPage;
