"use client";

import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Post } from "@/types/types";
import PostCard from "@/components/common/PostCard";
import { sectionVariants, staggerContainer } from "@/components/common/animation";
import { CustomSelect } from "@/components/common/CustomSelect";
import { useSearchParams, useRouter } from "next/navigation";
import HeroSection from "@/components/pages/HeroSection";
import { categories } from "@/data/categories";
import { SearchInput } from "@/components/common/SearchInput";

// Postのメタデータの型を定義
type PostMetadata = Omit<Post, "content">;

// Propsの型を定義
interface BlogClientProps {
  posts: PostMetadata[];
  totalPages: number;
  currentPage: number;
  totalPosts: number | null;
}

const BlogClient = ({
  posts,
  totalPages,
  currentPage,
  totalPosts,
}: BlogClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLパラメータを取得
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";

  // URLを組み立てて遷移するヘルパー関数
  const navigate = (page: number, category: string, search: string) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (category && category !== "all") {
      params.set("category", category);
    }
    if (search) {
      params.set("search", search);
    }
    router.push(`?${params.toString()}`);
  };

  // スクロール処理を共通化
  const scrollToSearchSection = () => {
    const section = document.getElementById("search-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      // フォールバックとしてページ上部にスクロール
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // --- イベントハンドラ ---

  const handleSearch = (query: string) => {
    navigate(1, categoryParam, query);
  };

  const handleResetSearch = () => {
    navigate(1, categoryParam, "");
  };

  const handleCategoryChange = (slug: string) => {
    navigate(1, slug, searchParam);
  };

  const handlePageChange = (page: number) => {
    navigate(page, categoryParam, searchParam);
  };

  const handlePrev = () => {
    navigate(Math.max(1, currentPage - 1), categoryParam, searchParam);
  };

  const handleNext = () => {
    navigate(Math.min(totalPages, currentPage + 1), categoryParam, searchParam);
  };

  // searchParamsが変更された後にスクロールを実行
  useEffect(() => {
    // URLに何らかのクエリパラメータがある場合のみスクロール
    if (searchParams.toString()) {
      scrollToSearchSection();
    }
  }, [searchParams]);

  // --- ページネーション番号の生成ロジック (useMemoで不要な再計算を防ぐ) ---
  const paginationNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);

    return pages;
  }, [totalPages, currentPage]);

  // --- JSX ---
  return (
    <div>
      {/* ==================== Hero Section ==================== */}
      <HeroSection
        src="/images/Spain/toledo-view.jpg"
        alt="Blog Hero Image"
        pageTitle="BLOG"
        pageMessage="旅の記録を、時系列で"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* ==================== Search ==================== */}
        <section id="search-section" className="mb-2">
          <SearchInput
            initialValue={searchParam}
            onSearch={handleSearch}
            onReset={handleResetSearch}
          />
          <p className="text-xs text-muted-foreground px-2 mt-1">
            ヒント:
            「&quot;絶景&quot;」のように囲むとフレーズ検索、-除外したい単語
            も使えます。
          </p>
        </section>

        {/* ==================== Total Results ==================== */}
        {totalPosts !== null && (
          <section className="mb-4 text-center">
            <p className="text-lg font-medium text-foreground">
              検索結果: <span className="font-bold">{totalPosts}</span>件
            </p>
          </section>
        )}

        {/* ==================== Filters ==================== */}
        <section className="mb-12">
          <CustomSelect
            options={categories}
            value={categoryParam}
            onChange={handleCategoryChange}
            labelPrefix="カテゴリー"
          />
        </section>

        {/* ==================== Article List ==================== */}
        {posts.length > 0 ? (
          <motion.section
            key={currentPage}
            variants={staggerContainer()}
            className="flex flex-col gap-16 md:gap-20 mb-12"
          >
            {posts.map((post, index) => {
              const motionProps =
                index === 0
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
                    isReversed={index % 2 !== 0}
                    showMetadata={true}
                  />
                </motion.div>
              );
            })}
          </motion.section>
        ) : (
          // 検索結果がない場合の表示
          <div className="rounded-2xl border bg-card px-6 py-16 text-center">
            <p className="text-xl text-foreground">該当する記事が見つかりませんでした。</p>
            <p className="mt-2 text-sm text-muted-foreground">検索条件またはカテゴリを変更してお試しください。</p>
          </div>
        )}

        {/* ==================== Pagination ==================== */}
        {totalPages > 1 && (
          <section className="mt-16 flex flex-wrap justify-center items-center gap-2">
            {/* Prevボタン */}
            {currentPage > 1 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-lg bg-gray-200 text-black"
              >
                Prev
              </button>
            )}

            {/* ページ番号 */}
            {paginationNumbers.map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
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

            {/* Nextボタン */}
            {currentPage < totalPages && (
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-lg bg-gray-200 text-black"
              >
                Next
              </button>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogClient;
