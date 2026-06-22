"use client";

import { useEffect, useMemo, useState } from "react";
import { Post } from "@/types/types";
import PostCard from "@/components/common/PostCard";
import { Reveal } from "@/components/common/Reveal";
import { useSearchParams, useRouter } from "next/navigation";
import { Compass, MapPin } from "lucide-react";
import HeroSection from "@/components/pages/HeroSection";
import { SearchInput } from "@/components/common/SearchInput";
import { FilterButton } from "@/components/features/search/FilterButton";
import FilterModal from "@/components/features/search/FilterModal";
import {
  FilterValue,
  LensKey,
  SortKey,
  countActiveFilters,
  normalizeFilterValue,
  sortOptions,
} from "@/data/searchFilters";
import { SEARCH_QUERY_MAX_LENGTH } from "@/lib/searchService";
import { getRegionBySlug } from "@/lib/regionUtil";
import { cn } from "@/lib/utils";

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
    lens?: LensKey;
    sort?: SortKey;
  };
};

const PURPOSE_PRESETS: DiscoveryPreset[] = [
  {
    id: "first-overseas",
    label: "初海外向け",
    kind: "purpose",
    query: {
      search: "初海外",
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
    },
  },
  {
    id: "city-transport",
    label: "市内移動",
    kind: "purpose",
    query: {
      category: "tourism",
      topic: "transport",
    },
  },
  {
    id: "practical-prep",
    label: "実用準備",
    kind: "purpose",
    query: {
      lens: "practical",
    },
  },
  {
    id: "travel-thinking",
    label: "旅の考え方",
    kind: "purpose",
    query: {
      category: "one-off",
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
    },
  },
  {
    id: "kuala-lumpur",
    label: "クアラルンプール",
    kind: "city",
    query: {
      region: "kuala-lumpur",
    },
  },
  {
    id: "santorini",
    label: "サントリーニ",
    kind: "city",
    query: {
      region: "santorini",
    },
  },
];

interface BlogClientProps {
  posts: PostMetadata[];
  totalPages: number;
  currentPage: number;
  totalPosts: number | null;
  activeSort: SortKey;
  activeLens: LensKey;
  availableTags: string[];
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

type DiscoveryState = {
  page: number;
  category: string;
  topic: string;
  search: string;
  sort: SortKey;
  lens: LensKey;
  region: string;
  tags: string[];
};

const normalizePresetQuery = (query: DiscoveryPreset["query"]) => ({
  category: query.category || "all",
  topic: query.topic || "all",
  search: query.search || "",
  region: query.region || "all",
  lens: query.lens || ("all" as LensKey),
  sort: query.sort || ("recommended" as SortKey),
  tags: [] as string[],
});

const BlogClient = ({
  posts,
  totalPages,
  currentPage,
  totalPosts,
  activeSort,
  activeLens,
  availableTags,
}: BlogClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const rawCategoryParam = searchParams.get("category") || "all";
  const rawTopicParam = searchParams.get("topic") || "all";
  const searchParam = searchParams.get("search") || "";
  const regionParam = searchParams.get("region") || "all";
  const tagsParam = (searchParams.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const { category: categoryParam, topic: topicParam } = normalizeFilters(
    rawCategoryParam,
    rawTopicParam,
  );
  const regionLabel =
    regionParam !== "all" ? getRegionBySlug(regionParam)?.name || regionParam : null;

  const currentState: DiscoveryState = {
    page: currentPage,
    category: categoryParam,
    topic: topicParam,
    search: searchParam,
    sort: activeSort,
    lens: activeLens,
    region: regionParam,
    tags: tagsParam,
  };

  const navigate = (next: Partial<DiscoveryState>) => {
    const state: DiscoveryState = { ...currentState, page: 1, ...next };
    const normalized = normalizeFilters(state.category, state.topic);
    const params = new URLSearchParams();
    params.set("page", String(state.page));
    if (state.sort !== "recommended") {
      params.set("sort", state.sort);
    }
    if (normalized.category !== "all") {
      params.set("category", normalized.category);
    }
    if (normalized.topic !== "all") {
      params.set("topic", normalized.topic);
    }
    if (state.lens !== "all") {
      params.set("lens", state.lens);
    }
    if (state.region !== "all") {
      params.set("region", state.region);
    }
    if (state.tags.length > 0) {
      params.set("tags", state.tags.join(","));
    }
    if (state.search) {
      params.set("search", state.search);
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
    navigate({ search: query.slice(0, SEARCH_QUERY_MAX_LENGTH) });
  };

  const handleResetSearch = () => {
    navigate({ search: "" });
  };

  const handleSortChange = (sort: SortKey) => {
    navigate({ sort });
  };

  const handleApplyFilter = (value: FilterValue) => {
    const normalized = normalizeFilterValue(value);
    navigate({
      category: normalized.category,
      topic: normalized.topic,
      lens: normalized.lens,
      tags: normalized.tags,
    });
  };

  // 「人気のタグ」は絞り込みモーダルのタグと同じ集合・同じ state を共有する。
  // ここでトグルすると絞り込みのタグも連動して切り替わる。
  const handleTagToggle = (tag: string) => {
    const nextTags = tagsParam.includes(tag)
      ? tagsParam.filter((t) => t !== tag)
      : [...tagsParam, tag];
    navigate({ tags: nextTags });
  };

  // クイックアクセス（目的・エリア）は curated な開始点なので、条件を丸ごと差し替える。
  const handlePresetSelect = (preset: DiscoveryPreset) => {
    const normalized = normalizePresetQuery(preset.query);
    navigate({
      category: normalized.category,
      topic: normalized.topic,
      search: normalized.search,
      region: normalized.region,
      lens: normalized.lens,
      sort: normalized.sort,
      tags: normalized.tags,
    });
  };

  const handleClearAll = () => {
    navigate({
      category: "all",
      topic: "all",
      search: "",
      region: "all",
      lens: "all",
      sort: "recommended",
      tags: [],
    });
  };

  const handleClearRegion = () => {
    navigate({ region: "all" });
  };

  const handlePageChange = (page: number) => {
    navigate({ page });
  };

  const handlePrev = () => {
    navigate({ page: Math.max(1, currentPage - 1) });
  };

  const handleNext = () => {
    navigate({ page: Math.min(totalPages, currentPage + 1) });
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

  const currentFilter: FilterValue = {
    category: categoryParam,
    topic: topicParam,
    lens: activeLens,
    tags: tagsParam,
  };

  const activeFilterCount = countActiveFilters(currentFilter);

  // クイックアクセスのプリセットが現在の条件と完全一致しているか（アクティブ表示用）。
  const activePreset = [...PURPOSE_PRESETS, ...CITY_PRESETS].find((preset) => {
    const normalized = normalizePresetQuery(preset.query);
    return (
      normalized.category === currentState.category &&
      normalized.topic === currentState.topic &&
      normalized.search === currentState.search &&
      normalized.region === currentState.region &&
      normalized.lens === currentState.lens &&
      normalized.sort === currentState.sort &&
      currentState.tags.length === 0
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
    activeLens !== "all" ||
    tagsParam.length > 0 ||
    activeSort !== "recommended";

  const searchPlaceholder = "キーワードで探す...";

  const renderPreset = (preset: DiscoveryPreset, Icon: typeof Compass) => {
    const isActive = activePreset?.id === preset.id;
    return (
      <button
        key={preset.id}
        onClick={() => handlePresetSelect(preset)}
        aria-pressed={isActive}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all duration-200",
          isActive
            ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
            : "border-border/60 bg-background text-foreground hover:-translate-y-[1px] hover:border-amber-300 hover:bg-amber-50/40 dark:hover:bg-amber-950/20",
        )}
      >
        <Icon className="h-3.5 w-3.5 opacity-70" />
        {preset.label}
      </button>
    );
  };

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
          <div className="relative z-10 space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-foreground text-2xl font-bold tracking-tight">記事を探す</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                キーワード・絞り込み・並び替えで、お探しの記事にたどり着けます。
              </p>
            </div>

            {/* 検索バー + 絞り込み（絞り込みは検索の真横に置いて見つけやすく） */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex-grow">
                <SearchInput
                  initialValue={searchParam}
                  placeholder={searchPlaceholder}
                  maxLength={SEARCH_QUERY_MAX_LENGTH}
                  onSearch={handleSearch}
                  onReset={handleResetSearch}
                />
              </div>
              <FilterButton
                variant="prominent"
                onClick={() => setIsFilterOpen(true)}
                activeCount={activeFilterCount}
                className="shrink-0 sm:py-2.5"
              />
            </div>

            {/* 並び替え（検索セクション内に統合） + 件数 + クリア */}
            <div className="border-border/50 flex flex-wrap items-center gap-x-4 gap-y-3 border-t pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-sm font-semibold">並び替え</span>
                <div className="flex flex-wrap gap-1.5">
                  {sortOptions.map((tab) => {
                    const isActive = tab.value === activeSort;
                    return (
                      <button
                        key={tab.value}
                        onClick={() => handleSortChange(tab.value)}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 ${
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

              <div className="ml-auto flex flex-wrap items-center gap-3">
                {totalPosts !== null && (
                  <span className="border-border/50 bg-background inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium shadow-sm">
                    該当{" "}
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {totalPosts}件
                    </span>
                  </span>
                )}
                {hasRefinements && (
                  <button
                    onClick={handleClearAll}
                    className="text-muted-foreground flex items-center gap-1.5 text-sm transition hover:text-red-500"
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
                    すべてクリア
                  </button>
                )}
              </div>
            </div>

            {/* 人気のタグ（絞り込みのタグと連動） */}
            {availableTags.length > 0 && (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm font-semibold">
                  人気のタグから絞り込む
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  {availableTags.map((tag) => {
                    const isActive = tagsParam.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        aria-pressed={isActive}
                        className={`group relative overflow-hidden rounded-full px-5 py-2 text-sm font-medium shadow-sm transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-md ${
                          isActive
                            ? "dark:ring-offset-background bg-amber-500 text-white ring-2 ring-amber-500 ring-offset-2"
                            : "border-border/60 text-foreground dark:bg-background border bg-white hover:border-amber-300"
                        } `}
                      >
                        {!isActive && (
                          <div className="absolute inset-0 translate-y-full bg-amber-50/50 transition-transform duration-300 ease-out group-hover:translate-y-0" />
                        )}
                        <span className="relative z-10">#{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* クイックアクセス（目的・エリアの定番ショートカット） */}
            <div className="border-border/50 grid gap-5 border-t pt-4 sm:grid-cols-2">
              <div className="space-y-3">
                <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-semibold">
                  <Compass className="h-4 w-4" />
                  目的から探す
                </p>
                <div className="flex flex-wrap gap-2">
                  {PURPOSE_PRESETS.map((preset) => renderPreset(preset, Compass))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-semibold">
                  <MapPin className="h-4 w-4" />
                  エリアから探す
                </p>
                <div className="flex flex-wrap gap-2">
                  {CITY_PRESETS.map((preset) => renderPreset(preset, MapPin))}
                </div>
              </div>
            </div>

            {regionLabel && (
              <button
                onClick={handleClearRegion}
                className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 transition hover:bg-sky-100 dark:bg-sky-950/30 dark:text-sky-300"
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
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                「{regionLabel}」で絞り込み中 ✕
              </button>
            )}
          </div>
        </section>

        <h2 className="text-foreground border-border/50 mb-6 border-b pb-2 text-xl font-bold">
          {currentSummaryTitle}
        </h2>

        {posts.length > 0 ? (
          <section
            key={`${currentPage}-${categoryParam}-${topicParam}-${searchParam}-${activeSort}-${activeLens}-${regionParam}-${tagsParam.join("_")}`}
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
              検索条件または絞り込みを変更してお試しください。
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

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        value={currentFilter}
        onApply={handleApplyFilter}
        availableTags={availableTags}
      />
    </div>
  );
};

export default BlogClient;
