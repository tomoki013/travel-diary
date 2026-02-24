"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ChevronRight, MapPin } from "lucide-react";
import { getDatePrefix } from "@/lib/dateFormat";
import { Post } from "@/types/types";
import { featuredSeries } from "@/data/series";
import { getRegionPath, getValidRegionsBySlugs } from "@/lib/regionUtil";
import { categories } from "@/data/categories";

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
  const category = categories.filter(
    (category) => category.slug === post.category
  );
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
      {/* Promotion */}
      {post.isPromotion && (
        <section className="flex justify-center items-center my-8 text-gray-800 italic bg-white/80 h-12 rounded-sm border border-secondary">
          <p>
            ※本記事はプロモーションを含みます。詳しくは
            <Link
              href={`/affiliates`}
              className="text-secondary underline hover:text-primary"
            >
              アフィリエイトポリシー
            </Link>
            をご覧ください。
          </p>
        </section>
      )}

      {/* Breadcrumbs */}
      <nav
        className="flex flex-col md:flex-row md:items-center text-sm text-gray-500 mb-4"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-secondary">
          ホーム
        </Link>
        {country && (
          <>
            <ChevronRight size={16} className="mx-1" />
            <Link
              href={`/destination/${country.slug}`}
              className="hover:text-secondary"
            >
              {country.name}
            </Link>
          </>
        )}
        <ChevronRight size={16} className="mx-1" />
        <span className="truncate">{post.title}</span>
      </nav>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-2 mb-4">
        {series && (
          <Link
            href={`/series/${series.slug}`}
            className="bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold rounded-full hover:bg-amber-200"
          >
            {series.title}
          </Link>
        )}
        {category &&
          category.map((cat) => (
            <Link
              key={cat.slug}
              href={`/posts?category=${cat.slug}`}
              className="bg-teal-100 text-teal-700 px-3 py-1 text-xs font-semibold rounded-full hover:bg-teal-200"
            >
              {cat.title}
            </Link>
          ))}
        {post.tags &&
          post.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/posts?search=${tag}`}
              className="bg-purple-100 text-purple-700 px-3 py-1 text-xs font-semibold rounded-full hover:bg-purple-200"
            >
              {tag}
            </Link>
          ))}
      </div>

      <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
        {post.title}
      </h1>
      <div className="text-muted-foreground mb-6 flex justify-between items-center">
        <p>
          {getDatePrefix(post.category)}: {post.dates.join(" ~ ")}
        </p>
        <section className="flex flex-col md:flex-row md:items-center gap-2">
          {regionTags.map((r) => (
            <Link
              key={r.slug}
              href={`/destination/${r.slug}`}
              className="hover:text-foreground"
            >
              <MapPin className="inline mr-0.5" size={16} />
              {r.name}
            </Link>
          ))}
        </section>
      </div>

      {/* Featured Image */}
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={1200}
          height={675}
          className="w-full rounded-lg shadow-lg aspect-video object-cover"
          priority
        />
      )}

      {/* Attention Box */}
      <section className="my-8 flex items-center gap-x-3 rounded-md border border-l-4 border-l-yellow-400 bg-yellow-50 p-4 text-yellow-800">
        <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        <p className="text-sm">
          この記事は<span className="underline">{post.dates[0]}</span>
          に作成されたものです。最新の情報に注意をして旅行をしてください。
        </p>
      </section>
        </>
      )}
    </motion.header>
  );
};

export default PostHeader;
