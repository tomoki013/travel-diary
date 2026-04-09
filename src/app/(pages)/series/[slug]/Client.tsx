"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Post, Series } from "@/types/types";
type PostMetadata = Omit<Post, "content">;
import PostCard from "@/components/common/PostCard";
import { sectionVariants, staggerContainer } from "@/components/common/animation";
import HeroSection from "@/components/pages/HeroSection";
import Button from "@/components/common/Button";

interface SeriesPageProps {
  allPosts: PostMetadata[];
  series: Series;
}

const POSTS_PER_PAGE = 6;

const Client = ({ allPosts, series }: SeriesPageProps) => {
  // URLパラメータからページ番号を取得
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState(
    pageParam ? Number(pageParam) : 1
  );
  // ページ番号クリック時もスクロール＆URL更新
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`?page=${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // ページ移動時にスクロール＆URL更新
  const handlePrev = () => {
    const prevPage = Math.max(1, currentPage - 1);
    setCurrentPage(prevPage);
    router.push(`?page=${prevPage}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleNext = () => {
    const nextPage = Math.min(totalPages, currentPage + 1);
    setCurrentPage(nextPage);
    router.push(`?page=${nextPage}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ページネーションのロジック
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // ページネーション表示用ページ番号リスト生成
  const getPaginationNumbers = () => {
    if (totalPages <= 7) {
      // ページ数が少ない場合は全て表示
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: number[] = [];
    pages.push(1);
    // 前後2ページ分表示
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    if (start > 2) {
      // ...を表示
      pages.push(-1); // -1は省略記号
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < totalPages - 1) {
      pages.push(-1);
    }
    pages.push(totalPages);
    return pages;
  };

  return (
    <div>
      {/* ==================== Hero Section ==================== */}
      <HeroSection
        src={series.imageUrl}
        alt={series.title}
        pageTitle={`SERIES: ${series.title}`}
        pageMessage={series.description}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* ==================== Series Description ==================== */}
        <div className="mb-12 text-center text-muted-foreground space-y-4 max-w-3xl mx-auto">
          <p className="text-lg text-foreground font-medium">
            {series.description}
          </p>
          <p className="text-sm md:text-base leading-relaxed">
            このシリーズでは、特定のテーマに沿って「ともきちの旅行日記」の記事をピックアップしています。
            一つの視点から旅を深掘りすることで、新しい発見やインスピレーションが見つかるかもしれません。
          </p>
          <div className="w-20 h-0.5 bg-primary/30 mx-auto mt-6" />
        </div>

        {/* ==================== Article List ==================== */}
        <motion.section
          key={currentPage}
          variants={staggerContainer()}
          className="mb-12 grid gap-5 md:grid-cols-2 md:gap-6"
        >
          {paginatedPosts.map((post) => {
            const motionProps =
              currentPage === 1
                ? {
                    initial: { opacity: 0, y: 30 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.8 },
                  }
                : {
                    initial: "hidden",
                    whileInView: "visible",
                    viewport: { once: true, amount: 0.3 },
                    transition: { duration: 0.8 },
                  };
            return (
              <motion.div
                key={post.slug}
                {...motionProps}
                variants={sectionVariants}
              >
                <PostCard
                  post={post}
                  showDiscoveryNote={true}
                  size="compact"
                />
              </motion.div>
            );
          })}
        </motion.section>

        {/* ==================== Pagination ==================== */}
        <section className="mt-16 flex justify-center items-center gap-2">
          {/* Prevボタン: 1ページ目では非表示 */}
          {currentPage !== 1 && (
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-lg bg-gray-200 text-black"
            >
              Prev
            </button>
          )}
          {/* ページ番号表示 */}
          {getPaginationNumbers().map((page, idx) =>
            page === -1 ? (
              <span key={"ellipsis-" + idx} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {page}
              </button>
            )
          )}
          {/* Nextボタン: 最終ページでは非表示 */}
          {currentPage !== totalPages && (
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-gray-200 text-black"
            >
              Next
            </button>
          )}
        </section>

        {/* ==================== Back to Series Index ==================== */}
        <Button href={`/series`}>シリーズ一覧へ戻る</Button>
      </div>
    </div>
  );
};

export default Client;
