"use client";

import Image from "next/image";
import { Post } from "@/types/types";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { getCategoryTitle, getTravelTopicTitle } from "@/data/categories";
import { getPostDiscoveryNote } from "@/lib/post-discovery";
import { getRegionBySlug } from "@/lib/regionUtil";

type PostMetadata = Omit<Post, "content">;

interface PostCardProps {
  post: PostMetadata;
  // isReversed and showMetadata are kept for compatibility but ignored in new design
  isReversed?: boolean;
  showMetadata?: boolean;
  variant?: "default" | "relate";
  showDiscoveryNote?: boolean;
  size?: "default" | "compact";
}

const PostCard = ({
  post,
  variant = "default",
  showDiscoveryNote = false,
  size = "default",
}: PostCardProps) => {
  if (variant === "relate") {
    // Keep existing relate variant or update if needed.
  }

  const isCompact = size === "compact";
  const categoryTitle = getCategoryTitle(post.category);
  const isTourismPost = post.category === "tourism";
  const topicTitles = (isTourismPost ? post.travelTopics || [] : [])
    .map((topic) => getTravelTopicTitle(topic))
    .filter((title): title is string => Boolean(title))
    .slice(0, isCompact ? 2 : 3);
  const discoveryNote = showDiscoveryNote ? getPostDiscoveryNote(post) : undefined;
  const primaryLocation = post.location?.[0];
  const primaryLocationLabel = primaryLocation
    ? getRegionBySlug(primaryLocation)?.name || primaryLocation
    : undefined;

  return (
    <Link href={`/posts/${post.slug}`} className="block group h-full">
      <article
        className={`relative flex h-full flex-col overflow-hidden transition-all duration-500 ${
          isCompact
            ? "rounded-2xl border border-border/70 bg-card p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg"
            : "rounded-3xl p-5 shadow-md hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
        }`}
      >
        {isCompact ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-background via-orange-50/45 to-amber-50/55 dark:from-background dark:via-orange-950/20 dark:to-amber-950/20" />
            <div className="absolute inset-0 rounded-2xl border border-orange-200/50 dark:border-orange-700/40 group-hover:border-orange-300/70 dark:group-hover:border-orange-600/60 transition-colors duration-300" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-amber-50/50 to-rose-50/60 dark:from-orange-950/30 dark:via-rose-950/25 dark:to-pink-950/30 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-100/20 to-orange-100/25 dark:via-amber-900/10 dark:to-orange-900/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-3xl border-2 border-orange-200/60 dark:border-orange-700/50 group-hover:border-amber-300/80 dark:group-hover:border-amber-600/60 transition-colors duration-500" />
            <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-300/20 via-orange-300/12 to-rose-300/20 dark:from-amber-600/20 dark:via-orange-600/12 dark:to-rose-600/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </>
        )}

        <div className="relative z-10 flex flex-col h-full">
          <div
            className={`relative mb-4 overflow-hidden ${
              isCompact
                ? "aspect-[16/9] rounded-xl ring-1 ring-border/60"
                : "aspect-[16/10] rounded-2xl shadow-lg ring-1 ring-orange-200/20 dark:ring-orange-700/20 group-hover:ring-amber-200/30 dark:group-hover:ring-amber-600/30 transition-all duration-500"
            }`}
          >
            {post.image && (
              <>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                    isCompact
                      ? "group-hover:scale-105"
                      : "transform group-hover:scale-110 group-hover:rotate-1"
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t via-transparent transition-colors duration-500 ${
                    isCompact
                      ? "from-black/30 to-transparent"
                      : "from-orange-900/15 to-transparent group-hover:from-orange-900/8"
                  }`}
                />
              </>
            )}
            {isTourismPost && categoryTitle && (
              <div
                className={`absolute left-3 top-3 rounded-full text-white ring-1 ring-white/20 transition-transform duration-300 ${
                  isCompact
                    ? "bg-black/60 px-3 py-1 text-[11px] font-semibold backdrop-blur-sm"
                    : "bg-gradient-to-r from-orange-400/90 to-amber-400/90 px-4 py-1.5 text-xs font-bold shadow-lg group-hover:scale-105 dark:from-orange-500/90 dark:to-amber-500/90"
                }`}
              >
                {categoryTitle}
              </div>
            )}
          </div>

          <div className="flex flex-col flex-grow">
            {discoveryNote && (
              <p
                className={`mb-2 font-semibold text-orange-600 dark:text-amber-300 ${
                  isCompact ? "text-[11px] tracking-[0.14em]" : "text-xs tracking-[0.16em]"
                }`}
              >
                {discoveryNote}
              </p>
            )}

            {topicTitles.length > 0 && (
              <div className={`mb-3 flex flex-wrap ${isCompact ? "gap-1.5" : "gap-2"}`}>
                {topicTitles.map((topicTitle) => (
                  <span
                    key={topicTitle}
                    className={`inline-flex items-center rounded-full bg-sky-100 font-semibold text-sky-700 dark:bg-sky-950/70 dark:text-sky-200 ${
                      isCompact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1 text-xs"
                    }`}
                  >
                    {topicTitle}
                  </span>
                ))}
              </div>
            )}

            {!isTourismPost && categoryTitle && (
              <p
                className={`mb-2 font-semibold uppercase text-muted-foreground/80 ${
                  isCompact ? "text-[11px] tracking-[0.2em]" : "text-xs tracking-[0.24em]"
                }`}
              >
                {categoryTitle}
              </p>
            )}

            <h3
              className={`font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 ${
                isCompact ? "mb-2 text-lg" : "mb-3 text-xl"
              }`}
            >
              {post.title}
            </h3>
            <p
              className={`text-muted-foreground leading-relaxed ${
                isCompact ? "mb-3 line-clamp-2 text-sm" : "mb-4 line-clamp-3 text-sm"
              }`}
            >
              {post.excerpt}
            </p>

            <div
              className={`mt-auto flex items-center justify-between gap-3 border-orange-200/30 dark:border-orange-700/30 ${
                isCompact ? "border-t pt-3" : "border-t pt-4"
              }`}
            >
              <div className={`font-medium text-muted-foreground ${isCompact ? "text-[11px]" : "text-xs"}`}>
                <span className="flex items-center gap-1">
                  <span className={`inline-block rounded-full bg-orange-400/70 dark:bg-amber-500/70 ${isCompact ? "h-1 w-1" : "h-1 w-1"}`} />
                  {post.dates.join(" ~ ")}
                </span>
                {primaryLocationLabel && (
                  <span className={`mt-1 flex items-center gap-1 ${isCompact ? "text-[11px]" : ""}`}>
                    <MapPin size={isCompact ? 11 : 12} />
                    {primaryLocationLabel}
                  </span>
                )}
              </div>
              <span
                className={`flex items-center font-bold text-orange-600 transition-all duration-300 group-hover:gap-2 dark:text-amber-400 ${
                  isCompact ? "gap-1 text-xs" : "gap-1 text-sm"
                }`}
              >
                続きを読む{" "}
                <ChevronRight
                  size={isCompact ? 13 : 14}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
