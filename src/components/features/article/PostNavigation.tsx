"use client";

import Link from "next/link";
import { featuredSeries } from "@/data/series";
import { ChevronLeft, ChevronRight, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostLink {
  href: string;
  title: string;
}

interface PostNavigationProps {
  previousPost?: PostLink;
  nextPost?: PostLink;
  previousCategoryPost?: PostLink;
  nextCategoryPost?: PostLink;
  previousSeriesPost?: PostLink;
  nextSeriesPost?: PostLink;
  series?: string;
  category?: string;
}

const NavigationCard = ({
  post,
  direction,
  label,
  className,
}: {
  post: PostLink;
  direction: "prev" | "next";
  label: string;
  className?: string;
}) => {
  const isNext = direction === "next";
  return (
    <Link
      href={post.href}
      className={cn(
        "group relative flex flex-1 flex-col justify-center gap-2 overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:border-amber-500 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900/40 dark:hover:border-amber-500",
        isNext ? "text-right items-end" : "text-left items-start",
        className
      )}
    >
      <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors group-hover:text-amber-600", isNext && "flex-row-reverse")}>
        {isNext ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        <span>{label}</span>
      </div>
      <p className="line-clamp-2 text-sm font-bold leading-relaxed text-stone-800 transition-colors group-hover:text-stone-900 dark:text-stone-200 dark:group-hover:text-white md:text-base">
        {post.title}
      </p>
    </Link>
  );
};

const PostNavigation = ({
  previousPost,
  nextPost,
  previousSeriesPost,
  nextSeriesPost,
  series,
}: PostNavigationProps) => {
  const seriesTitle = featuredSeries.find((s) => s.slug === series)?.title;

  return (
    <div className="space-y-6">
      {/* Series Navigation (Prioritized if exists) */}
      {(previousSeriesPost || nextSeriesPost) && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500">
              <ListOrdered className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-stone-500 dark:text-stone-400">
              シリーズ「<span className="text-stone-900 dark:text-stone-200">{seriesTitle}</span>」の続き
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {previousSeriesPost ? (
              <NavigationCard post={previousSeriesPost} direction="prev" label="Previous Part" />
            ) : <div className="hidden sm:block" />}
            {nextSeriesPost && (
              <NavigationCard post={nextSeriesPost} direction="next" label="Next Part" className="border-amber-200 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-900/10" />
            )}
          </div>
        </div>
      )}

      {/* General Navigation */}
      {(previousPost || nextPost) && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
              Related Reads
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {previousPost ? (
              <NavigationCard post={previousPost} direction="prev" label="Prev Post" />
            ) : <div className="hidden sm:block" />}
            {nextPost ? (
              <NavigationCard post={nextPost} direction="next" label="Next Post" />
            ) : <div className="hidden sm:block" />}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostNavigation;
