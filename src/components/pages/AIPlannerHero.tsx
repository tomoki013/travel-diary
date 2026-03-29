"use client";

import Link from "next/link";
import { Sparkles, Plane, ExternalLink } from "lucide-react";
import { AI_PLANNER_PATH } from "@/constants/site";

interface AIPlannerHeroProps {
  compact?: boolean;
}

const AIPlannerHero = ({ compact = false }: AIPlannerHeroProps) => {
  return (
    <section className={`relative z-30 ${compact ? "py-8" : "-mt-10 py-20"}`}>
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col items-center gap-8 border border-border/50 bg-muted/30 shadow-sm md:flex-row ${
            compact ? "rounded-3xl p-6 md:p-8" : "rounded-none p-8 md:rounded-3xl md:p-12"
          }`}
        >
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles size={14} /> {compact ? "Utility" : "New Feature"}
            </div>
            <h2 className={`mb-4 font-heading font-bold text-foreground ${compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"}`}>
              {compact ? "AIで旅のたたき台を作る" : "AIと創る、あなただけの旅"}
            </h2>
            <p className="mb-8 leading-loose text-muted-foreground">
              {compact
                ? "記事で情報収集したあとに、日程や予算のたたき台を素早く作りたいときの補助機能です。"
                : "面倒な旅行計画はAIにおまかせ。あなたの希望を伝えるだけで、オリジナルの旅行プランを数秒で作成します。"}
            </p>
            <Link
              href={AI_PLANNER_PATH}
              className={`mx-auto flex w-fit items-center gap-2 rounded-full bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 md:mx-0 ${
                compact ? "px-6 py-3" : "px-8 py-4"
              }`}
            >
              <Plane size={18} /> {compact ? "AIでたたき台を作る" : "今すぐ無料でプランを作成"}
              <ExternalLink size={16} className="opacity-70 ml-1" />
            </Link>
          </div>

          {/* AI Chat UI Mockup */}
          <div className={`w-full flex-1 ${compact ? "max-w-sm" : "max-w-md"}`}>
            <div className={`transform space-y-4 rounded-2xl border border-border/50 bg-card shadow-xl transition-transform duration-500 hover:rotate-0 ${
              compact ? "p-5 rotate-0" : "p-6 rotate-2"
            }`}>
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
