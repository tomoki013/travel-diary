"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 font-sans text-slate-50">
      {/* 背景画像：旅の情景（霧の山道や広い空など、迷いつつも美しい場所） */}
      {/* Next.jsのImageコンポーネントを使う場合は差し替えてください */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Greece/oia-castle-sunset-view.jpg"
          alt="Travel Landscape"
          fill
          className="h-full w-full object-cover opacity-40 transition-transform duration-1000 hover:scale-105"
        />
        {/* グラデーションオーバーレイ：文字の可読性を確保しつつ、雰囲気を出す */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
      </div>

      {/* メインコンテンツエリア */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center md:px-12">
        {/* 巨大な404タイポグラフィ - 背景に溶け込ませる */}
        <h1 className="select-none text-[12rem] font-bold leading-none tracking-tighter text-white/10 mix-blend-overlay blur-[2px] md:text-[20rem]">
          404
        </h1>

        {/* メッセージカード - グラスモーフィズム */}
        <div className="-mt-20 max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-2xl md:-mt-32 md:p-12">
          <div className="mb-6 flex justify-center">
            {/* コンパスのアイコン装飾 */}
            <div className="rounded-full bg-white/10 p-3 ring-1 ring-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-sky-200 animate-spin"
                style={{ animationDuration: "4s" }}
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
          </div>

          <h2 className="mb-4 text-2xl font-bold tracking-wide text-white md:text-3xl">
            Destination Unknown
          </h2>

          <p className="mb-8 text-sm leading-relaxed text-slate-300 md:text-base">
            お探しのページは、地図の座標から外れてしまったようです。
            <br className="hidden md:block" />
            旅には予期せぬ寄り道がつきもの。新しい目的地へ出発しましょう。
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {/* ホームに戻るボタン */}
            <Link
              href="/"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3 text-sm font-medium text-slate-900 transition-all hover:bg-sky-50 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <span>トップページへ戻る</span>
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>

            {/* 記事一覧へ（オプション） */}
            <Link
              href="/posts"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              旅の記録を読む
            </Link>
          </div>
        </div>
      </div>

      {/* フッター装飾 */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs font-light tracking-[0.2em] text-slate-500 uppercase">
          Tomokichi&apos;s Travel Diary
        </p>
      </div>

      {/* ノイズテクスチャ（フィルム写真のような質感を追加） */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
