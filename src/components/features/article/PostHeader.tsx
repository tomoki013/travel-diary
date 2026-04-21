"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, MapPin } from "lucide-react";
import { getDatePrefix } from "@/lib/dateFormat";
import { Post } from "@/types/types";
import { featuredSeries } from "@/data/series";
import { getRegionPath, getValidRegionsBySlugs } from "@/lib/regionUtil";
import { getCategoryTitle, getTravelTopicTitle } from "@/data/categories";
import { members } from "@/data/member";

interface PostHeaderProps {
  post: Post;
  variant?: "full" | "titleOnly";
}

const PostHeader = ({ post, variant = "full" }: PostHeaderProps) => {
  const series = featuredSeries.find((s) => s.slug === post.series);
  const regionTags = getValidRegionsBySlugs(post.location || []);
  const primarySlug =
    post.location && post.location.length > 0 ? post.location[0] : undefined;
  const regionPath = primarySlug ? getRegionPath(primarySlug) : [];
  const country = regionPath.length > 0 ? regionPath[1] : null;
  const categoryTitle = getCategoryTitle(post.category);
  const topicTitles = (post.travelTopics || [])
    .map((topic) => getTravelTopicTitle(topic))
    .filter((title): title is string => Boolean(title));
  const isTitleOnly = variant === "titleOnly";
  const author = members.find((m) => m.name === post.author);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {isTitleOnly ? (
        <h1 className="mb-2 text-3xl font-bold text-foreground md:text-5xl">
          {post.title}
        </h1>
      ) : (
        <>
          {post.isPromotion && (
            <section className="my-6 flex items-center justify-center rounded-md border border-stone-200 bg-stone-100 py-3 text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-400 md:text-sm">
              <p>
                ※本記事はプロモーションを含みます。詳しくは
                <Link
                  href={`/affiliates`}
                  className="text-amber-600 dark:text-amber-400 underline hover:text-amber-700 ml-1"
                >
                  アフィリエイトポリシー
                </Link>
                をご覧ください。
              </p>
            </section>
          )}

          <nav
            className="mb-6 flex flex-wrap items-center text-xs font-medium text-stone-500 dark:text-stone-400 md:text-sm"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            {country && (
              <>
                <ChevronRight size={14} className="mx-1.5 opacity-50" />
                <Link
                  href={`/destination/${country.slug}`}
                  className="hover:text-amber-600 transition-colors"
                >
                  {country.name}
                </Link>
              </>
            )}
            <ChevronRight size={14} className="mx-1.5 opacity-50" />
            <span className="truncate text-stone-700 dark:text-stone-300">
              {post.title}
            </span>
          </nav>

          <div className="mb-6 flex flex-wrap gap-2">
            {series && (
              <Link
                href={`/series/${series.slug}`}
                className="rounded-md bg-amber-100/80 px-3 py-1 text-xs font-bold tracking-wide text-amber-800 shadow-sm transition-colors hover:bg-amber-200/80 dark:bg-amber-900/30 dark:text-amber-200"
              >
                {series.title}
              </Link>
            )}
            {categoryTitle && (
              <Link
                href={`/posts?category=${post.category}`}
                className="rounded-md bg-stone-100 px-3 py-1 text-xs font-bold tracking-wide text-stone-700 shadow-sm transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
              >
                {categoryTitle}
              </Link>
            )}
            {topicTitles.map((topicTitle, index) => (
              <Link
                key={`${topicTitle}-${index}`}
                href={`/posts?topic=${post.travelTopics?.[index]}`}
                className="rounded-md bg-stone-100 px-3 py-1 text-xs font-bold tracking-wide text-stone-700 shadow-sm transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
              >
                {topicTitle}
              </Link>
            ))}
            {post.tags &&
              post.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/posts?search=${tag}`}
                  className="rounded-md bg-stone-100 px-3 py-1 text-xs font-bold tracking-wide text-stone-700 shadow-sm transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
                >
                  #{tag}
                </Link>
              ))}
          </div>

          <h1 className="mb-6 text-3xl font-extrabold leading-[1.3] tracking-tight text-stone-900 dark:text-stone-50 md:text-5xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mb-8 flex flex-col justify-between gap-4 border-y border-stone-200 py-4 text-sm font-medium text-stone-600 dark:border-stone-800 dark:text-stone-400 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest opacity-80">
                {getDatePrefix(post.category)}
              </span>
              <span className="font-code text-stone-900 dark:text-stone-300">
                {post.dates.join(" - ")}
              </span>
            </div>

            {regionTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {regionTags.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/destination/${r.slug}`}
                    className="flex items-center transition-colors hover:text-amber-600 dark:hover:text-amber-400"
                  >
                    <MapPin className="mr-1 opacity-70" size={16} />
                    {r.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {post.category === "tourism" && post.excerpt && (
            <section className="mb-10 rounded-xl border border-stone-200 bg-stone-50/50 p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/20 md:p-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-500">
                Introduction
              </p>
              <p className="text-base leading-loose text-stone-800 dark:text-stone-200 md:text-lg">
                {post.excerpt}
              </p>
            </section>
          )}

          {post.image && (
            <div className="mb-10 overflow-hidden rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={675}
                className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          )}

        </>
      )}
    </motion.header>
  );
};

export default PostHeader;
