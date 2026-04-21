"use client";

import Link from "next/link";
import Image from "next/image";

interface ErrorDisplayProps {
  reset?: () => void;
}

export default function ErrorDisplay({ reset }: ErrorDisplayProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 font-sans text-slate-50">
      {/* Background Image (Same as not-found) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/India/tajmahal.jpg"
          alt="Travel Landscape"
          fill
          className="h-full w-full object-cover opacity-40 transition-transform duration-1000 hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center md:px-12">
        {/* Huge Typography */}
        <h1 className="select-none text-[10rem] font-bold leading-none tracking-tighter text-white/10 mix-blend-overlay blur-[2px] md:text-[15rem]">
          Error
        </h1>

        {/* Glassmorphism Card */}
        <div className="-mt-20 max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-2xl md:-mt-32 md:p-12">
          <div className="mb-6 flex justify-center">
            {/* Alert Icon */}
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
                className="text-red-200"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" x2="12" y1="9" y2="13" />
                <line x1="12" x2="12.01" y1="17" y2="17" />
              </svg>
            </div>
          </div>

          <h2 className="mb-4 text-2xl font-bold tracking-wide text-white md:text-3xl">
            Something went wrong!
          </h2>

          <p className="mb-8 text-sm leading-relaxed text-slate-300 md:text-base">
            予期せぬエラーが発生しました。
            <br className="hidden md:block" />
            一時的な問題の可能性があります。もう一度お試しください。
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {/* Retry Button */}
            {reset && (
              <button
                onClick={reset}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3 text-sm font-medium text-slate-900 transition-all hover:bg-sky-50 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <span>再読み込み</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:rotate-180"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
              </button>
            )}

            {/* Return to Home Button */}
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              トップページへ戻る
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs font-light tracking-[0.2em] text-slate-500 uppercase">
          Tomokichi&apos;s Travel Diary
        </p>
      </div>

      {/* Noise Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
