"use client";

import { useEffect, useMemo } from "react";
import { Post } from "@/types/types";
import PostCard from "@/components/common/PostCard";
import { Reveal } from "@/components/common/Reveal";
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
  const viewParam = (searchParams.get("view") as BlogDiscoveryView | null) || activeView;
  const regionParam = searchParams.get("region") || "all";
  const { category: categoryParam, topic: topicParam } = normalizeFilters(
    rawCategoryParam,
    rawTopicParam,
  );
  const regionLabel =
    regionParam !== "all" ? getRegionBySlug(regionParam)?.name || regionParam : null;

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

  const currentSummaryTitle =
    activePreset?.kind === "purpose"
      ? `${activePreset.label}で絞り込み中`
      : activePreset?.kind === "city"
        ? `${activePreset.label}の記事を表示中`
        : searchParam
          ? `「${searchParam}」の検索結果`
          : regionLabel
            ? `${regionLabel}の記事`
            : "記事一覧";

  const hasRefinements =
    Boolean(searchParam) ||
    categoryParam !== "all" ||
    topicParam !== "all" ||
    regionParam !== "all" ||
    viewParam !== "recommended";

  const searchPlaceholder = "キーワードで探す...";

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

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <section
          id="discovery-hub"
          className="border-border/40 bg-card/70 relative mb-10 overflow-hidden rounded-[2rem] border p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8"
        >
          <div className="relative z-10 space-y-8">
            <div className="text-center md:text-left">
              <h2 className="text-foreground text-2xl font-bold tracking-tight">記事を探す</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                キーワードやタグ、カテゴリから読みたい記事だけを絞り込めます。
              </p>
            </div>

            {/* 検索バー */}
            <div className="w-full">
              <SearchInput
                initialValue={searchParam}
                placeholder={searchPlaceholder}
                onSearch={handleSearch}
                onReset={handleResetSearch}
              />
            </div>

            {/* クイックスタートタグ */}
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm font-semibold">人気のタグから見つける</p>
              <div className="flex flex-wrap items-center gap-2.5">
                {[...PURPOSE_PRESETS, ...CITY_PRESETS].map((preset) => {
                  const isActive = activePreset?.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className={`group relative overflow-hidden rounded-full px-5 py-2 text-sm font-medium shadow-sm transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-md ${
                        isActive
                          ? "dark:ring-offset-background bg-amber-500 text-white ring-2 ring-amber-500 ring-offset-2"
                          : "border-border/60 text-foreground dark:bg-background border bg-white hover:border-amber-300"
                      } `}
                    >
                      {/* Hover highlight effect */}
                      {!isActive && (
                        <div className="absolute inset-0 translate-y-full bg-amber-50/50 transition-transform duration-300 ease-out group-hover:translate-y-0" />
                      )}
                      <span className="relative z-10">#{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-border/50 bg-background/70 rounded-2xl border p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <h3 className="text-foreground text-sm font-semibold">絞り込み</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
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
              {regionLabel && (
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 dark:bg-sky-950/30 dark:text-sky-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  「{regionLabel}」の記事に絞り込み中
                </p>
              )}
            </div>

            <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 text-sm font-medium">
                {totalPosts !== null && (
                  <span className="border-border/50 bg-background inline-flex items-center gap-1.5 rounded-full border px-3 py-1 shadow-sm">
                    該当件数:{" "}
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {totalPosts}件
                    </span>
                  </span>
                )}
                {hasRefinements && (
                  <button
                    onClick={handleClearAll}
                    className="text-muted-foreground flex items-center gap-1.5 transition hover:text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    クリア
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="border-border/40 bg-card/60 mb-8 rounded-[1.75rem] border p-6 shadow-[0_8px_24px_rgb(0,0,0,0.03)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-foreground text-lg font-bold">並び替え</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                表示順だけを切り替えて、同じ条件のまま見やすい順に並べ替えます。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {viewTabs.map((tab) => {
                const isActive = tab.value === viewParam;
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleViewChange(tab.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-stone-900 text-stone-50 shadow-sm dark:bg-stone-100 dark:text-stone-900"
                        : "border-border/60 bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground border"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <h2 className="text-foreground border-border/50 mb-6 border-b pb-2 text-xl font-bold">
          {currentSummaryTitle}
        </h2>

        {posts.length > 0 ? (
          <section
            key={`${currentPage}-${categoryParam}-${topicParam}-${searchParam}-${viewParam}-${regionParam}`}
            className="mb-12 grid gap-5 md:grid-cols-2 md:gap-6"
          >
            {posts.map((post) =>
              currentPage === 1 ? (
                // 1ページ目はマウント時に即フェードイン(CSS animation)
                <div key={post.slug} className="animate-fade-up-mount">
                  <PostCard post={post} showDiscoveryNote size="compact" />
                </div>
              ) : (
                // 2ページ目以降はスクロールで画面に入ったらフェードイン
                <Reveal key={post.slug} amount={0.3} duration={0.8}>
                  <PostCard post={post} showDiscoveryNote size="compact" />
                </Reveal>
              ),
            )}
          </section>
        ) : (
          <div className="bg-card rounded-2xl border px-6 py-16 text-center">
            <p className="text-foreground text-xl">該当する記事が見つかりませんでした。</p>
            <p className="text-muted-foreground mt-2 text-sm">
              検索条件またはカテゴリ・ラベルを変更してお試しください。
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <section className="mt-16 flex flex-wrap items-center justify-center gap-2">
            {currentPage > 1 && (
              <button onClick={handlePrev} className="rounded-lg bg-gray-200 px-4 py-2 text-black">
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
                  className={`rounded-lg px-4 py-2 ${
                    currentPage === page ? "bg-teal-600 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            {currentPage < totalPages && (
              <button onClick={handleNext} className="rounded-lg bg-gray-200 px-4 py-2 text-black">
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
