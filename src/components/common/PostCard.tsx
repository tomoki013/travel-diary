"use client";

import Image from "next/image";
import { Post } from "@/types/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategoryTitle, getTravelTopicTitle } from "@/data/categories";

type PostMetadata = Omit<Post, "content">;

interface PostCardProps {
  post: PostMetadata;
  // isReversed and showMetadata are kept for compatibility but ignored in new design
  isReversed?: boolean;
  showMetadata?: boolean;
  variant?: "default" | "relate";
}

const PostCard = ({ post, variant = "default" }: PostCardProps) => {
  if (variant === "relate") {
    // Keep existing relate variant or update if needed.
  }

  const categoryTitle = getCategoryTitle(post.category);
  const isTourismPost = post.category === "tourism";
  const topicTitles = (isTourismPost ? post.travelTopics || [] : [])
    .map((topic) => getTravelTopicTitle(topic))
    .filter((title): title is string => Boolean(title))
    .slice(0, 3);

  return (
    <Link href={`/posts/${post.slug}`} className="block group h-full">
      <article className="relative flex flex-col h-full p-5 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-md hover:shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-amber-50/50 to-rose-50/60 dark:from-orange-950/30 dark:via-rose-950/25 dark:to-pink-950/30 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-100/20 to-orange-100/25 dark:via-amber-900/10 dark:to-orange-900/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 rounded-3xl border-2 border-orange-200/60 dark:border-orange-700/50 group-hover:border-amber-300/80 dark:group-hover:border-amber-600/60 transition-colors duration-500" />
        <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-300/20 via-orange-300/12 to-rose-300/20 dark:from-amber-600/20 dark:via-orange-600/12 dark:to-rose-600/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="overflow-hidden rounded-2xl mb-4 relative aspect-[16/10] shadow-lg ring-1 ring-orange-200/20 dark:ring-orange-700/20 group-hover:ring-amber-200/30 dark:group-hover:ring-amber-600/30 transition-all duration-500">
            {post.image && (
              <>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/15 via-transparent to-transparent group-hover:from-orange-900/8 transition-colors duration-500" />
              </>
            )}
            {isTourismPost && categoryTitle && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-400/90 to-amber-400/90 dark:from-orange-500/90 dark:to-amber-500/90 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-300">
                {categoryTitle}
              </div>
            )}
          </div>

          <div className="flex flex-col flex-grow">
            {topicTitles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {topicTitles.map((topicTitle) => (
                  <span
                    key={topicTitle}
                    className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/70 dark:text-sky-200"
                  >
                    {topicTitle}
                  </span>
                ))}
              </div>
            )}

            {!isTourismPost && categoryTitle && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground/80">
                {categoryTitle}
              </p>
            )}

            <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
              {post.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
              {post.excerpt}
            </p>

            <div className="mt-auto pt-4 border-t border-orange-200/30 dark:border-orange-700/30 flex justify-between items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-orange-400/70 dark:bg-amber-500/70" />
                {post.dates.join(" ~ ")}
              </span>
              <span className="text-sm font-bold text-orange-600 dark:text-amber-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                続きを読む{" "}
                <ChevronRight
                  size={14}
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
