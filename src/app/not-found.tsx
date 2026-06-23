import Link from "next/link";
import { Compass, ArrowRight, BookOpen, Image as ImageIcon, MapPin } from "lucide-react";

const quickLinks = [
  {
    href: "/posts",
    label: "ブログ一覧",
    description: "旅の記録を読む",
    icon: BookOpen,
  },
  {
    href: "/destination",
    label: "地域別に探す",
    description: "行き先から記事をたどる",
    icon: MapPin,
  },
  {
    href: "/gallery",
    label: "写真ギャラリー",
    description: "景色から旅を選ぶ",
    icon: ImageIcon,
  },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-stone-50 px-6 py-20 text-stone-900 dark:bg-[#080808] dark:text-stone-100">
      {/* 背景の淡いグラデーション装飾 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 50% 0%, rgba(217,119,6,0.10), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        {/* コンパスアイコン */}
        <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
          <Compass
            className="h-8 w-8 animate-spin text-amber-600 dark:text-amber-500"
            style={{ animationDuration: "6s" }}
            strokeWidth={1.5}
          />
        </div>

        {/* 大きな 404 */}
        <p className="font-heading text-7xl font-extrabold tracking-tight text-stone-900 sm:text-8xl dark:text-stone-50">
          404
        </p>
        <p className="font-code mt-3 text-xs tracking-[0.3em] text-amber-600 uppercase dark:text-amber-500">
          Destination Unknown
        </p>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
          お探しのページが見つかりません
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-600 sm:text-base dark:text-stone-400">
          ページが移動・削除されたか、URL が間違っている可能性があります。
          旅には予期せぬ寄り道がつきもの。新しい目的地へ出発しましょう。
        </p>

        {/* プライマリ導線 */}
        <Link
          href="/"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-amber-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-md"
        >
          トップページへ戻る
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        {/* クイックリンク */}
        <div className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {quickLinks.map(({ href, label, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900/50 dark:hover:border-amber-500/40"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600 transition-colors group-hover:bg-amber-100 group-hover:text-amber-700 dark:bg-stone-800 dark:text-stone-300 dark:group-hover:bg-amber-900/30 dark:group-hover:text-amber-400">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-bold text-stone-800 dark:text-stone-100">{label}</span>
              <span className="text-xs text-stone-500 dark:text-stone-400">{description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
