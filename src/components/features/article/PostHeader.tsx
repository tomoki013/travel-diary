"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ChevronRight, MapPin } from "lucide-react";
import { getDatePrefix } from "@/lib/dateFormat";
import { Post } from "@/types/types";
import { featuredSeries } from "@/data/series";
import { getRegionPath, getValidRegionsBySlugs } from "@/lib/regionUtil";
import { getCategoryTitle, getTravelTopicTitle } from "@/data/categories";
import { members } from "@/data/member";
import { User, Calendar, CheckCircle } from "lucide-react";

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
            <section className="flex justify-center items-center my-6 text-stone-600 dark:text-stone-400 text-xs md:text-sm bg-stone-100 dark:bg-stone-900/50 py-3 rounded-md border border-stone-200 dark:border-stone-800">
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
            className="flex flex-wrap items-center text-xs md:text-sm text-stone-500 dark:text-stone-400 mb-6 font-medium"
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

          <div className="flex flex-wrap gap-2 mb-6">
            {series && (
              <Link
                href={`/series/${series.slug}`}
                className="bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 px-3 py-1 text-xs font-bold tracking-wide rounded-md hover:bg-amber-200/80 transition-colors shadow-sm"
              >
                {series.title}
              </Link>
            )}
            {categoryTitle && (
              <Link
                href={`/posts?category=${post.category}`}
                className="bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-3 py-1 text-xs font-bold tracking-wide rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors shadow-sm"
              >
                {categoryTitle}
              </Link>
            )}
            {topicTitles.map((topicTitle, index) => (
              <Link
                key={`${topicTitle}-${index}`}
                href={`/posts?topic=${post.travelTopics?.[index]}`}
                className="bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-3 py-1 text-xs font-bold tracking-wide rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors shadow-sm"
              >
                {topicTitle}
              </Link>
            ))}
            {post.tags &&
              post.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/posts?search=${tag}`}
                  className="bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-3 py-1 text-xs font-bold tracking-wide rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors shadow-sm"
                >
                  #{tag}
                </Link>
              ))}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold text-stone-900 dark:text-stone-50 mb-6 leading-[1.3] tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-stone-200 dark:border-stone-800 mb-8 text-sm text-stone-600 dark:text-stone-400 font-medium">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-widest text-xs opacity-80">
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
                    className="flex items-center hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <MapPin className="mr-1 opacity-70" size={16} />
                    {r.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {post.category === "tourism" && post.excerpt && (
            <section className="mb-10 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/20 p-6 md:p-8 shadow-sm">
              <p className="text-xs font-bold tracking-[0.2em] text-amber-700 dark:text-amber-500 mb-3 uppercase">
                Introduction
              </p>
              <p className="leading-loose text-stone-800 dark:text-stone-200 text-base md:text-lg">
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

          <section className="my-8 rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* 著者情報 */}
              <div className="flex items-center gap-3">
                {members.find((m) => m.name === post.author) ? (
                  <Image
                    src={
                      members.find((m) => m.name === post.author)?.image ||
                      "/favicon.ico"
                    }
                    alt={post.author || "ともきちの旅行日記"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">執筆者</span>
                  <span className="text-sm font-semibold">
                    {post.author || "ともきちの旅行日記"}
                  </span>
                </div>
              </div>

              {/* 日付情報 */}
              <div className="flex flex-col gap-1 sm:text-right">
                <div className="flex items-center gap-2 sm:justify-end">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    実際の訪問時期:
                  </span>
                  <span className="text-sm font-medium">{post.dates[0]}</span>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  <CheckCircle className="h-4 w-4 text-teal-600" />
                  <span className="text-xs text-muted-foreground">
                    情報最終確認:
                  </span>
                  <span className="text-sm font-medium">記事公開時</span>
                </div>
              </div>
            </div>

            {/* 免責事項 */}
            <div className="mt-4 flex items-start gap-3 rounded-md bg-muted/50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                当ブログは実体験に基づいて執筆していますが、価格や営業時間などの情報は変動する可能性があります。旅行の際は最新の公式情報も併せてご確認ください。
              </p>
            </div>
          </section>
        </>
      )}
    </motion.header>
  );
};

export default PostHeader;
