"use client";

import Link from "next/link";
import { Sparkles, Plane, ExternalLink } from "lucide-react";

const AIPlannerHero = () => {
  return (
    <section className="relative z-30 -mt-10 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-12 rounded-none border border-border/50 bg-muted/30 p-8 shadow-sm md:flex-row md:rounded-3xl md:p-12">
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles size={14} /> New Feature
            </div>
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              AIと創る、あなただけの旅
            </h2>
            <p className="mb-8 leading-loose text-muted-foreground">
              面倒な旅行計画はAIにおまかせ。あなたの希望を伝えるだけで、オリジナルの旅行プランを数秒で作成します。
            </p>
            <Link
              href="https://ai.tomokichidiary.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto flex w-fit items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 md:mx-0"
            >
              <Plane size={18} /> 今すぐ無料でプランを作成
              <ExternalLink size={16} className="opacity-70 ml-1" />
            </Link>
          </div>

          {/* AI Chat UI Mockup */}
          <div className="w-full max-w-md flex-1">
            <div className="transform space-y-4 rounded-2xl border border-border/50 bg-card p-6 shadow-xl transition-transform duration-500 rotate-2 hover:rotate-0">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles size={20} className="text-primary" />
                </div>
                <div className="w-full rounded-2xl rounded-tl-none bg-muted/50 p-4 text-sm text-foreground">
                  <p>
                    次の旅行の計画をお手伝いします。行き先や期間、予算を教えてください。
                  </p>
                </div>
              </div>
              <div className="flex flex-row-reverse gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                  ME
                </div>
                <div className="rounded-2xl rounded-tr-none bg-primary p-4 text-sm text-primary-foreground shadow-md shadow-primary/20">
                  <p>来月、3泊4日で京都に行きたいです。予算は5万円くらい。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIPlannerHero;
