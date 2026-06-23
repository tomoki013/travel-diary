"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
import { members } from "@/data/member";
import { Post } from "@/types/types";
import RelatedPosts from "@/components/features/article/RelatedPosts";
import FloatingTableOfContent from "@/components/features/article/FloatingTableOfContent";
import TableOfContent, {
  useHeadings,
  useScrollSync,
} from "@/components/features/article/TableOfContent";
import PostHeader from "@/components/features/article/PostHeader";
import PostNavigation from "@/components/features/article/PostNavigation";
import Button from "@/components/common/Button";
import ShareButtons from "@/components/features/article/ShareButtons";
import AffiliateCard from "@/components/common/AffiliateCard";
import { affiliates } from "@/constants/affiliates";
import CostBreakdown from "@/components/features/article/CostBreakdown";
import { AlertCircle, Calendar, CheckCircle, Info, ArrowRight } from "lucide-react";

type ClientPost = Omit<Post, "content">;

interface ClientProps {
  children: React.ReactNode;
  post: ClientPost;
  headings?: { id: string; text: string; level: number }[];
  previousPost?: { href: string; title: string };
  nextPost?: { href: string; title: string };
  regionRelatedPosts?: Omit<Post, "content">[];
  previousCategoryPost?: { href: string; title: string };
  nextCategoryPost?: { href: string; title: string };
  previousSeriesPost?: { href: string; title: string };
  nextSeriesPost?: { href: string; title: string };
}

const Client = ({
  children,
  post,
  headings: propHeadings,
  previousPost,
  nextPost,
  regionRelatedPosts,
  previousCategoryPost,
  nextCategoryPost,
  previousSeriesPost,
  nextSeriesPost,
}: ClientProps) => {
  const headings = useHeadings(!propHeadings);
  const activeId = useScrollSync(propHeadings ?? headings, true);
  const author = members.find((m) => m.name === post.author);

  const finalHeadings = propHeadings ?? headings;

  return (
    <div className="relative">
      <FloatingTableOfContent headings={finalHeadings} activeId={activeId} />
      {/* 旧 motion.div は transition のみ指定で animate 対象がなく実質静的だった */}
      <div className="relative z-40 mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <PostHeader post={post} variant="full" />

        {post.costReport?.costs?.items && <CostBreakdown costs={post.costReport.costs.items} />}

        <div className="my-12">
          <TableOfContent headings={finalHeadings} activeId={activeId} isScrollSyncEnabled />
        </div>

        <div className="mt-12 w-full">
          <article id="post-article-body" className="max-w-none">
            {children}
          </article>
        </div>

        {/* 記事終わり直後の共有セクション(自己紹介カードから独立) */}
        <div className="mt-16 space-y-6 rounded-2xl border border-stone-200 bg-stone-50/30 p-6 sm:p-8 dark:border-stone-800 dark:bg-stone-900/40">
          <h4 className="text-center text-xs font-bold tracking-widest text-stone-400 uppercase">
            Share this journey
          </h4>
          <ShareButtons post={post} />
        </div>

        {(post.promotionPrograms?.length ?? 0) > 0 && (
          <div className="my-16">
            <h2 className="font-heading mb-8 text-center text-2xl font-bold tracking-wide text-stone-800 dark:text-stone-200">
              この記事で紹介したサービス
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {affiliates
                .filter(
                  (affiliate) =>
                    post.promotionPrograms?.includes(affiliate.name) &&
                    affiliate.status === "ready",
                )
                .map((affiliate) => (
                  <AffiliateCard key={affiliate.name} affiliate={affiliate} type={affiliate.type} />
                ))}
            </div>
          </div>
        )}

        <Reveal as="footer" className="mt-24 space-y-24" amount={0.05}>
          {/* Section 1: Next Journeys - Single Column Focused Flow */}
          <div className="relative">
            <div className="absolute inset-0 -mx-4 rounded-[3rem] bg-stone-50/50 sm:-mx-8 lg:-mx-12 dark:bg-stone-900/20" />
            <div className="relative space-y-20 px-4 py-16 sm:px-8 lg:px-12">
              <div className="space-y-3 text-center">
                <span className="text-xs font-bold tracking-[0.3em] text-amber-600 uppercase dark:text-amber-500">
                  Next Step
                </span>
                <h2 className="font-heading text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                  旅の続きへ
                </h2>
              </div>

              {/* 1. Primary Navigation (Next/Prev/Series) */}
              <div className="mx-auto max-w-3xl">
                <PostNavigation
                  previousPost={previousPost}
                  nextPost={nextPost}
                  previousCategoryPost={previousCategoryPost}
                  nextCategoryPost={nextCategoryPost}
                  previousSeriesPost={previousSeriesPost}
                  nextSeriesPost={nextSeriesPost}
                  series={post.series?.slug}
                  category={post.category}
                />
              </div>

              {/* 2. Related Discovery (Visual Cards) */}
              {regionRelatedPosts && (
                <div className="space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                    <h3 className="text-xs font-bold tracking-[0.2em] text-stone-400 uppercase">
                      More to Explore
                    </h3>
                    <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                  </div>
                  <RelatedPosts posts={regionRelatedPosts} />
                </div>
              )}

              <div className="flex justify-center pt-8">
                <Button
                  href="/posts"
                  className="group inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm font-bold text-stone-900 shadow-sm ring-1 ring-stone-200 transition-all hover:bg-stone-50 hover:shadow-md dark:text-stone-200 dark:ring-stone-800"
                >
                  <span>すべての旅の記録を見る</span>
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Section 4: Post Script - Author and Meta Info */}
          <div className="rounded-[3rem] border border-stone-200 bg-stone-50/30 px-6 py-12 sm:px-12 dark:border-stone-800 dark:bg-[#0c0c0c]/50">
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
              <Image
                src={author?.image || "/favicon.ico"}
                alt={author?.name || "ともきち"}
                width={80}
                height={80}
                className="rounded-full grayscale transition-all hover:grayscale-0"
              />
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                    Written by
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    {author?.name}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                  {author?.description}
                </p>
                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <Calendar className="h-3.5 w-3.5" />
                    訪問日:{" "}
                    <span className="font-bold text-stone-600 dark:text-stone-300">
                      {post.travelDates
                        ? post.travelDates.end
                          ? `${post.travelDates.start} - ${post.travelDates.end}`
                          : post.travelDates.start
                        : post.publishedAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <CheckCircle className="h-3.5 w-3.5 text-teal-600" />
                    最終更新:{" "}
                    <span className="font-bold text-stone-600 dark:text-stone-300">
                      {post.updatedAt || post.publishedAt}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-6 border-t border-stone-200 pt-12 md:grid-cols-2 dark:border-stone-800">
              <div className="flex gap-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600/50" />
                <p className="text-[11px] leading-relaxed text-stone-400">
                  当ブログは実体験に基づいて執筆していますが、価格や営業時間などの情報は変動する可能性があります。旅行の際は最新の公式情報も併せてご確認ください。
                </p>
              </div>
              <div className="flex gap-4">
                <Info className="h-5 w-5 shrink-0 text-stone-400/50" />
                <p className="text-[11px] leading-relaxed text-stone-400">
                  記事制作では一部に AI
                  を補助的に活用する場合があります。執筆方針や情報確認については
                  <Link
                    href="/editorial-policy"
                    className="font-bold text-stone-500 hover:text-amber-600"
                  >
                    執筆・編集ポリシー
                  </Link>
                  をご確認ください。
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Client;
