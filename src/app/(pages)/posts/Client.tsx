"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Post } from "@/types/types";
import PostCard from "@/components/common/PostCard";
import { sectionVariants, staggerContainer } from "@/components/common/animation";
import { CustomSelect } from "@/components/common/CustomSelect";
import { useSearchParams, useRouter } from "next/navigation";
import HeroSection from "@/components/pages/HeroSection";
import { articleCategories, travelTopicOptions } from "@/data/categories";
import { SearchInput } from "@/components/common/SearchInput";
import { BlogDiscoveryView } from "@/lib/post-discovery";
import { getRegionBySlug } from "@/lib/regionUtil";

type PostMetadata = Omit<Post, "content">;

type DiscoveryPreset = {
  id: string;
  label: string;
  kind: "purpose" | "city";
  query: {
    category?: string;
    topic?: string;
    search?: string;
    region?: string;
    view?: BlogDiscoveryView;
  };
};

const PURPOSE_PRESETS: DiscoveryPreset[] = [
  {
    id: "first-overseas",
    label: "初海外向け",
    kind: "purpose",
    query: {
      search: "初海外",
      view: "recommended",
    },
  },
  {
    id: "airport-access",
    label: "空港アクセス",
    kind: "purpose",
    query: {
      category: "tourism",
      topic: "transport",
      search: "空港",
      view: "practical",
    },
  },
  {
    id: "city-transport",
    label: "市内移動",
    kind: "purpose",
    query: {
      category: "tourism",
      topic: "transport",
      view: "practical",
    },
  },
  {
    id: "practical-prep",
    label: "実用準備",
    kind: "purpose",
    query: {
      view: "practical",
    },
  },
  {
    id: "travel-thinking",
    label: "旅の考え方",
    kind: "purpose",
    query: {
      category: "one-off",
      view: "diary",
    },
  },
];

const CITY_PRESETS: DiscoveryPreset[] = [
  {
    id: "bangkok",
    label: "バンコク",
    kind: "city",
    query: {
      region: "bangkok",
      view: "recommended",
    },
  },
  {
    id: "kuala-lumpur",
    label: "クアラルンプール",
    kind: "city",
    query: {
      region: "kuala-lumpur",
      view: "recommended",
    },
  },
  {
    id: "santorini",
    label: "サントリーニ",
    kind: "city",
    query: {
      region: "santorini",
      view: "recommended",
    },
  },
];

interface BlogClientProps {
  leadPicks: PostMetadata[];
  posts: PostMetadata[];
  totalPages: number;
  currentPage: number;
  totalPosts: number | null;
  activeView: BlogDiscoveryView;
}

const normalizeFilters = (category: string, topic: string) => {
  let nextCategory = category;
  const nextTopic = topic;

  if (nextTopic !== "all") {
    nextCategory = "tourism";
  }

  return {
    category: nextCategory,
    topic: nextTopic,
  };
};

const normalizePresetQuery = (query: DiscoveryPreset["query"]) => ({
  category: query.category || "all",
  topic: query.topic || "all",
  search: query.search || "",
  region: query.region || "all",
  view: query.view || "recommended",
});

const BlogClient = ({
  leadPicks,
  posts,
  totalPages,
  currentPage,
  totalPosts,
  activeView,
}: BlogClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawCategoryParam = searchParams.get("category") || "all";
  const rawTopicParam = searchParams.get("topic") || "all";
  const searchParam = searchParams.get("search") || "";
  const viewParam =
    (searchParams.get("view") as BlogDiscoveryView | null) || activeView;
  const regionParam = searchParams.get("region") || "all";
  const { category: categoryParam, topic: topicParam } = normalizeFilters(
    rawCategoryParam,
    rawTopicParam,
  );
  const regionLabel =
    regionParam !== "all"
      ? getRegionBySlug(regionParam)?.name || regionParam
      : null;

  const navigate = (
    page: number,
    category: string,
    topic: string,
    search: string,
    view: BlogDiscoveryView,
    region: string,
  ) => {
    const normalized = normalizeFilters(category, topic);
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (view !== "recommended") {
      params.set("view", view);
    }
    if (normalized.category !== "all") {
      params.set("category", normalized.category);
    }
    if (normalized.topic !== "all") {
      params.set("topic", normalized.topic);
    }
    if (region !== "all") {
      params.set("region", region);
    }
    if (search) {
      params.set("search", search);
    }
    router.push(`?${params.toString()}`);
  };

  const scrollToDiscoveryHub = () => {
    const section = document.getElementById("discovery-hub");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearch = (query: string) => {
    navigate(1, categoryParam, topicParam, query, viewParam, regionParam);
  };

  const handleResetSearch = () => {
    navigate(1, categoryParam, topicParam, "", viewParam, regionParam);
  };

  const handleCategoryChange = (slug: string) => {
    const nextTopic = slug === "tourism" ? topicParam : "all";
    navigate(1, slug, nextTopic, searchParam, viewParam, regionParam);
  };

  const handleTopicChange = (slug: string) => {
    navigate(1, categoryParam, slug, searchParam, viewParam, regionParam);
  };

  const handleViewChange = (view: BlogDiscoveryView) => {
    navigate(1, categoryParam, topicParam, searchParam, view, regionParam);
  };

  const handlePresetSelect = (preset: DiscoveryPreset) => {
    const normalized = normalizePresetQuery(preset.query);
    navigate(
      1,
      normalized.category,
      normalized.topic,
      normalized.search,
      normalized.view,
      normalized.region,
    );
  };

  const handleClearAll = () => {
    navigate(1, "all", "all", "", "recommended", "all");
  };

  const handlePageChange = (page: number) => {
    navigate(page, categoryParam, topicParam, searchParam, viewParam, regionParam);
  };

  const handlePrev = () => {
    navigate(
      Math.max(1, currentPage - 1),
      categoryParam,
      topicParam,
      searchParam,
      viewParam,
      regionParam,
    );
  };

  const handleNext = () => {
    navigate(
      Math.min(totalPages, currentPage + 1),
      categoryParam,
      topicParam,
      searchParam,
      viewParam,
      regionParam,
    );
  };

  useEffect(() => {
    if (searchParams.toString()) {
      scrollToDiscoveryHub();
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

  const current = {
    category: categoryParam,
    topic: topicParam,
    search: searchParam,
    region: regionParam,
    view: viewParam,
  };

  const activePreset = [...PURPOSE_PRESETS, ...CITY_PRESETS].find((preset) => {
    const normalized = normalizePresetQuery(preset.query);
    return (
      normalized.category === current.category &&
      normalized.topic === current.topic &&
      normalized.search === current.search &&
      normalized.region === current.region &&
      normalized.view === current.view
    );
  });

  const hasRefinements =
    Boolean(searchParam) ||
    categoryParam !== "all" ||
    topicParam !== "all" ||
    regionParam !== "all" ||
    viewParam !== "recommended";

  const currentSummaryTitle =
    activePreset?.kind === "purpose"
      ? `${activePreset.label}から探す`
      : activePreset?.kind === "city"
        ? `${activePreset.label}の記事`
        : searchParam
          ? `「${searchParam}」の検索結果`
          : regionLabel
            ? `${regionLabel}の記事`
            : viewParam === "new"
              ? "新着から探す"
              : viewParam === "practical"
                ? "実用情報から探す"
                : viewParam === "diary"
                  ? "旅行記から探す"
                  : "おすすめから探す";

  const currentSummaryDescription =
    activePreset?.kind === "purpose"
      ? `${activePreset.label}の入口として読みやすい流れになっています。`
      : activePreset?.kind === "city"
        ? `${activePreset.label}に関する記事から、まず読みやすい順で見られます。`
        : searchParam
          ? "検索条件に近い記事から順に確認できます。"
          : viewParam === "new"
            ? "公開日の新しい記事から追えます。"
            : viewParam === "practical"
              ? "移動・予約・通信などの実用記事を先に見られます。"
              : viewParam === "diary"
                ? "旅程や体験ベースの記事を中心に追えます。"
                : "最初の入口として読みやすい記事から見つけられます。";

  const searchPlaceholder =
    activePreset?.kind === "purpose"
      ? `${activePreset.label}の中から探す`
      : activePreset?.kind === "city"
        ? `${activePreset.label}の記事を探す`
        : viewParam === "practical"
          ? "交通・予約・通信などで検索"
          : viewParam === "diary"
            ? "旅行記の行き先や体験で検索"
            : "キーワードで検索...";

  const leadTitle =
    activePreset?.kind === "purpose"
      ? `${activePreset.label}から読むなら`
      : activePreset?.kind === "city"
        ? `${activePreset.label}でまず読む3本`
        : searchParam
          ? "検索結果から先に読む3本"
          : "迷ったらこの3本";

  const leadDescription =
    activePreset || searchParam || regionParam !== "all"
      ? "今の入口に合う3本を先に並べています。"
      : "最初の一歩になりやすい3本から読み始められます。";

  const viewTabs: Array<{
    value: BlogDiscoveryView;
    label: string;
  }> = [
    {
      value: "recommended",
      label: "おすすめ",
    },
    {
      value: "new",
      label: "新着",
    },
    {
      value: "practical",
      label: "実用情報",
    },
    {
      value: "diary",
      label: "旅行記",
    },
  ];

  return (
    <div>
      <HeroSection
        src="/images/Spain/toledo-view.jpg"
        alt="Blog Hero Image"
        pageTitle="BLOG"
        pageMessage="次に読みたい記事の入口を見つける"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section
          id="discovery-hub"
          className="mb-14 rounded-[2rem] border border-border/70 bg-card/60 p-6 shadow-sm backdrop-blur-sm md:p-8"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                記事を探す
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {currentSummaryDescription}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {totalPosts !== null && (
                <div className="inline-flex rounded-full border border-border px-4 py-2 font-semibold text-foreground">
                  {currentSummaryTitle}・{totalPosts}件
                </div>
              )}
              {hasRefinements && (
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 font-semibold text-foreground transition hover:bg-muted"
                >
                  リセット
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {viewTabs.map((tab) => {
              const isActive = tab.value === viewParam;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleViewChange(tab.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-teal-500 bg-teal-50 text-teal-900 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-100"
                      : "border-border/70 bg-background text-foreground hover:border-orange-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap gap-2">
              {PURPOSE_PRESETS.map((preset) => {
                const isActive = activePreset?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-orange-400 bg-orange-50 text-orange-900 dark:border-orange-600 dark:bg-orange-950/40 dark:text-orange-100"
                        : "border-border bg-background text-foreground hover:border-orange-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                都市
              </span>
              {CITY_PRESETS.map((preset) => {
                const isActive = activePreset?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-sky-400 bg-sky-50 text-sky-900 dark:border-sky-600 dark:bg-sky-950/40 dark:text-sky-100"
                        : "border-border bg-background text-foreground hover:border-sky-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <SearchInput
              initialValue={searchParam}
              placeholder={searchPlaceholder}
              onSearch={handleSearch}
              onReset={handleResetSearch}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              入口を選んだあと、キーワードでさらに絞れます。
            </p>
          </div>

          <details className="mt-5 rounded-2xl border border-border/60 bg-background/70 p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
              詳しく絞る
            </summary>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <CustomSelect
                options={articleCategories}
                value={categoryParam}
                onChange={handleCategoryChange}
                labelPrefix="記事カテゴリ"
              />
              <CustomSelect
                options={travelTopicOptions}
                value={topicParam}
                onChange={handleTopicChange}
                labelPrefix="実用ラベル"
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              カテゴリは記事の形式、実用ラベルは交通・予約・通信などのテーマです。
              {regionLabel
                ? ` いまは「${regionLabel}」の記事に絞っています。`
                : ""}
            </p>
          </details>

          {leadPicks.length > 0 && (
            <div className="mt-8">
              <div className="mb-5">
                <h3 className="text-2xl font-bold text-foreground">
                  {leadTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {leadDescription}
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {leadPicks.map((post) => (
                  <PostCard key={post.slug} post={post} showDiscoveryNote />
                ))}
              </div>
            </div>
          )}
        </section>

        <h2 className="mb-8 text-2xl font-bold text-foreground">
          {currentSummaryTitle}
        </h2>

        {posts.length > 0 ? (
          <motion.section
            key={`${currentPage}-${categoryParam}-${topicParam}-${searchParam}-${viewParam}-${regionParam}`}
            variants={staggerContainer()}
            className="mb-12 grid gap-5 md:grid-cols-2 md:gap-6"
          >
            {posts.map((post) => {
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
                    showDiscoveryNote
                    size="compact"
                  />
                </motion.div>
              );
            })}
          </motion.section>
        ) : (
          <div className="rounded-2xl border bg-card px-6 py-16 text-center">
            <p className="text-xl text-foreground">
              該当する記事が見つかりませんでした。
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              検索条件またはカテゴリ・ラベルを変更してお試しください。
            </p>
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
