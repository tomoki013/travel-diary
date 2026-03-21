"use client";

import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Post } from "@/types/types";
import PostCard from "@/components/common/PostCard";
import { sectionVariants, staggerContainer } from "@/components/common/animation";
import { useSearchParams, useRouter } from "next/navigation";
import HeroSection from "@/components/pages/HeroSection";
import { articleCategories, travelTopicOptions } from "@/data/categories";
import { SearchInput } from "@/components/common/SearchInput";

// Postのメタデータの型を定義
type PostMetadata = Omit<Post, "content">;

type FilterOption = {
  slug: string;
  title: string;
};

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
}

const FilterButtonGroup = ({
  title,
  options,
  activeValue,
  onChange,
}: FilterGroupProps) => (
  <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur">
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
      {title}
    </p>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = activeValue === option.slug;
        return (
          <button
            key={option.slug}
            type="button"
            onClick={() => onChange(option.slug)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                : "border-border bg-background text-foreground hover:border-teal-300 hover:text-teal-700"
            }`}
          >
            {option.title}
          </button>
        );
      })}
    </div>
  </div>
);

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

  const categoryParam = searchParams.get("category") || "all";
  const topicParam = searchParams.get("topic") || "all";
  const searchParam = searchParams.get("search") || "";

  const navigate = (
    page: number,
    category: string,
    topic: string,
    search: string,
  ) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (category && category !== "all") {
      params.set("category", category);
    }
    if (topic && topic !== "all") {
      params.set("topic", topic);
    }
    if (search) {
      params.set("search", search);
    }
    router.push(`?${params.toString()}`);
  };

  const scrollToSearchSection = () => {
    const section = document.getElementById("search-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearch = (query: string) => {
    navigate(1, categoryParam, topicParam, query);
  };

  const handleResetSearch = () => {
    navigate(1, categoryParam, topicParam, "");
  };

  const handleCategoryChange = (slug: string) => {
    const nextTopic = slug === "tourism" || slug === "all" ? topicParam : "all";
    navigate(1, slug, nextTopic, searchParam);
  };

  const handlePageChange = (page: number) => {
    navigate(page, categoryParam, topicParam, searchParam);
  };

  const handlePrev = () => {
    navigate(Math.max(1, currentPage - 1), categoryParam, topicParam, searchParam);
  };

  const handleNext = () => {
    navigate(
      Math.min(totalPages, currentPage + 1),
      categoryParam,
      topicParam,
      searchParam,
    );
  };

  useEffect(() => {
    if (searchParams.toString()) {
      scrollToSearchSection();
    }
  }, [searchParams]);

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

  const topicFilterDisabled = categoryParam !== "all" && categoryParam !== "tourism";

  return (
    <div>
      <HeroSection
        src="/images/Spain/toledo-view.jpg"
        alt="Blog Hero Image"
        pageTitle="BLOG"
        pageMessage="旅の記録を、時系列で"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section id="search-section" className="mb-2 scroll-mt-24">
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

        {totalPosts !== null && (
          <section className="mb-4 text-center">
            <p className="text-lg font-medium text-foreground">
              検索結果: <span className="font-bold">{totalPosts}</span>件
            </p>
          </section>
        )}

        <section className="mb-12 grid gap-4">
          <FilterButtonGroup
            title="記事カテゴリ"
            options={articleCategories}
            activeValue={categoryParam}
            onChange={handleCategoryChange}
          />
          <div className={topicFilterDisabled ? "opacity-60" : ""}>
            <FilterButtonGroup
              title="実用ラベル（観光情報のみ）"
              options={travelTopicOptions}
              activeValue={topicParam}
              onChange={(slug) => {
                const nextCategory = slug === "all" ? categoryParam : "tourism";
                navigate(1, nextCategory, slug, searchParam);
              }}
            />
            <p className="mt-2 px-1 text-xs text-muted-foreground">
              実用ラベルは観光情報の記事だけに厳格に付けています。
              {topicFilterDisabled &&
                " 今は観光情報以外を見ているので、ラベルを押すと観光情報に切り替わります。"}
            </p>
          </div>
        </section>

        {posts.length > 0 ? (
          <motion.section
            key={`${currentPage}-${categoryParam}-${topicParam}-${searchParam}`}
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
          <div className="rounded-2xl border bg-card px-6 py-16 text-center">
            <p className="text-xl text-foreground">該当する記事が見つかりませんでした。</p>
            <p className="mt-2 text-sm text-muted-foreground">検索条件またはカテゴリ・ラベルを変更してお試しください。</p>
          </div>
        )}

        {totalPages > 1 && (
          <section className="mt-16 flex flex-wrap justify-center items-center gap-2">
            {currentPage > 1 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-lg bg-gray-200 text-black"
              >
                Prev
              </button>
            )}

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
              ),
            )}

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
