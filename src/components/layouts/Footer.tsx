"use client";

import {
  FOOTER_CONTENTS_LIST,
  FOOTER_ABOUT_LIST,
  FOOTER_COMMUNITY_LIST,
  FOOTER_LEGAL_LIST,
  SOCIAL_LIST,
} from "@/constants/navigation";
import Link from "next/link";
import { ExternalLink, Heart, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-stone-200 bg-stone-50/50 text-stone-900 dark:border-stone-800 dark:bg-[#080808] dark:text-stone-100">
      <div className="container mx-auto px-6 py-16 sm:px-8 lg:px-12">
        {/* Top Section: Main Navigation & Brand */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-8 lg:col-span-4">
            <div className="space-y-4">
              <Link href="/" className="group inline-flex flex-col">
                <span className="font-heading text-2xl font-bold tracking-tight">
                  ともきちの旅行日記
                </span>
                <span className="text-[10px] font-code uppercase tracking-[0.3em] text-stone-500 group-hover:text-amber-600 dark:text-stone-400">
                  Travel Diary Portfolio
                </span>
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                「一生モノの体験を、もっと身近に。」
                実体験に基づく旅の記録と、旅を豊かにする情報を発信しています。
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                Follow Journey
              </span>
              <div className="flex gap-4">
                {SOCIAL_LIST.map((sns) => (
                  <Link
                    key={sns.name}
                    href={sns.pass}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-stone-600 shadow-sm ring-1 ring-stone-200 transition-all hover:-translate-y-1 hover:bg-amber-600 hover:text-white hover:ring-amber-600 dark:bg-stone-900 dark:text-stone-400 dark:ring-stone-800 dark:hover:bg-amber-600 dark:hover:text-white"
                  >
                    {sns.icon}
                    <span className="sr-only">{sns.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                Explore
              </h3>
              <ul className="space-y-3">
                {FOOTER_CONTENTS_LIST.map((content) => (
                  <li key={content.name}>
                    <Link
                      href={content.pass}
                      className="group flex items-center gap-2 text-sm text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-200 transition-all group-hover:w-3 group-hover:bg-amber-500 dark:bg-stone-800" />
                      {content.name}
                      {content.isNew && (
                        <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          NEW
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">
                Resources
              </h3>
              <ul className="space-y-3">
                {[...FOOTER_ABOUT_LIST, ...FOOTER_COMMUNITY_LIST].map(
                  (link) => (
                    <li key={link.name}>
                      <Link
                        href={link.pass}
                        className="group flex items-center gap-1 text-sm text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                      >
                        {link.name}
                        {link.target === "_blank" && (
                          <ExternalLink className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                        )}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="space-y-6 col-span-2 sm:col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">
                Legal
              </h3>
              <ul className="space-y-3">
                {FOOTER_LEGAL_LIST.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.pass}
                      className="text-sm text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Affiliate Policy Section */}
        <div className="mt-16 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900/50 dark:ring-stone-800 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                <Heart className="h-4 w-4 fill-current" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Support our work
                </span>
              </div>
              <p className="max-w-2xl text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                当サイトはアフィリエイト広告を利用しています。掲載する商品・サービスは運営者が実際に試し、自信を持っておすすめできるものに限定しています。
              </p>
            </div>
            <Link
              href="/affiliates"
              className="inline-flex items-center gap-2 self-start rounded-xl bg-stone-100 px-5 py-3 text-xs font-bold transition-all hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700"
            >
              運営方針の詳細を見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-stone-200 pt-8 dark:border-stone-800 sm:flex-row">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            &copy; 2024-{new Date().getFullYear()} ともきちの旅行日記. All
            rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="flex items-center gap-1.5 text-xs text-stone-400">
              Made with <Heart className="h-3 w-3 text-red-500" /> in Japan
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
