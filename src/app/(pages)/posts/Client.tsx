"use client";

import { useEffect, useMemo, useOptimistic, useState, useTransition } from "react";
import { Post } from "@/types/types";
import PostCard from "@/components/common/PostCard";
import { Reveal } from "@/components/common/Reveal";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, Compass, MapPin } from "lucide-react";
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

// 検索セクション内のトグル系（並び替え・タグ・プリセット・ページ送り）の共通スタイル。
// 角丸はサイトのボタン基準（rounded-md）。アクセントは光らせたアンバーで、選択は塗り＋グロー、
// 未選択はホバーでアンバーの縁・文字＋淡いグロー。サイト全体のアンバー基調に揃える。
const PILL_BASE = "rounded-md text-sm font-semibold transition-colors duration-200";
const PILL_SELECTED =
  "border border-amber-500 bg-amber-500 text-white shadow-[0_1px_6px_-2px_rgba(245,158,11,0.35)]";
const PILL_UNSELECTED =
  "border border-border/60 bg-background text-muted-foreground hover:border-amber-400";
// 並び替えは「フィルタ適用」ではなく単一選択の切り替えなので、アンバーではなく
// 落ち着いた無彩色（セグメント風）で選択を示す。
const PILL_SELECTED_SORT =
  "border border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900";

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

// useOptimistic 用：パッチを当てつつ、URL 生成と同じ正規化（カテゴリ/実用ラベル）を適用する。
const reduceView = (state: DiscoveryState, patch: Partial<DiscoveryState>): DiscoveryState => {
  const merged = { ...state, ...patch };
  const normalized = normalizeFilters(merged.category, merged.topic);
  return { ...merged, category: normalized.category, topic: normalized.topic };
};

/**
 * 並び替えの独立コントロール。
 * モバイルはネイティブの `<select>`（省スペース）、PC はセグメントボタンで切り替える。
 */
const SortControl = ({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (sort: SortKey) => void;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-muted-foreground hidden text-sm font-semibold sm:inline">並び替え</span>

    {/* モバイル: セレクト */}
    <div className="relative sm:hidden">
      <label htmlFor="posts-sort" className="sr-only">
        並び替え
      </label>
      <select
        id="posts-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="border-border/60 bg-background text-foreground appearance-none rounded-md border py-1.5 pr-8 pl-3 text-sm font-semibold"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2" />
    </div>

    {/* PC: セグメントボタン */}
    <div className="hidden flex-wrap gap-1.5 sm:flex">
      {sortOptions.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "px-3.5 py-1.5",
              PILL_BASE,
              isActive ? PILL_SELECTED_SORT : PILL_UNSELECTED,
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  </div>
);

/** 記事カード（compact）のスケルトン。条件変更中の結果待ちに表示する。 */
const PostCardSkeleton = () => (
  <div className="border-border/70 bg-card rounded-2xl border p-4 shadow-sm">
    <div className="bg-muted aspect-[16/9] w-full animate-pulse rounded-xl" />
    <div className="mt-3 space-y-2">
      <div className="bg-muted h-3 w-1/3 animate-pulse rounded" />
      <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
      <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
      <div className="bg-muted mt-1 h-3 w-1/2 animate-pulse rounded" />
    </div>
  </div>
);

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

  // 反応を即時にするため、URL 遷移（サーバー再取得）の完了を待たずに選択状態を
  // 楽観的に更新する。遷移が終わると searchParams 由来の値へ自動で再同期される。
  const [isPending, startTransition] = useTransition();
  const [view, addOptimisticView] = useOptimistic(currentState, reduceView);

  const regionLabel =
    view.region !== "all" ? getRegionBySlug(view.region)?.name || view.region : null;

  const navigate = (next: Partial<DiscoveryState>) => {
    startTransition(() => {
      addOptimisticView({ ...next, page: 1 });
      const state: DiscoveryState = { ...currentState, page: 1, ...next };
      const normalized = normalizeFilters(state.category, state.topic);
      const params = new URLSearchParams();
      params.set("page", String(state.page));
      if (state.sort !== "recommended") params.set("sort", state.sort);
      if (normalized.category !== "all") params.set("category", normalized.category);
      if (normalized.topic !== "all") params.set("topic", normalized.topic);
      if (state.lens !== "all") params.set("lens", state.lens);
      if (state.region !== "all") params.set("region", state.region);
      if (state.tags.length > 0) params.set("tags", state.tags.join(","));
      if (state.search) params.set("search", state.search);
      // Next の自動トップスクロールを無効化（この後 scrollToResults で結果先頭へ
      // スムーズ移動するため。両方走るとトップへ飛んでから戻る二重挙動になる）。
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  // 条件変更（タグ追加・並び替え・ページ送り等）後は結果の先頭へスクロールする。
  const scrollToResults = () => {
    const section = document.getElementById("search-results");
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
    const nextTags = view.tags.includes(tag)
      ? view.tags.filter((t) => t !== tag)
      : [...view.tags, tag];
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
      scrollToResults();
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
    category: view.category,
    topic: view.topic,
    lens: view.lens,
    tags: view.tags,
  };

  const activeFilterCount = countActiveFilters(currentFilter);

  // クイックアクセスのプリセットが現在の条件と完全一致しているか（アクティブ表示用）。
  const activePreset = [...PURPOSE_PRESETS, ...CITY_PRESETS].find((preset) => {
    const normalized = normalizePresetQuery(preset.query);
    return (
      normalized.category === view.category &&
      normalized.topic === view.topic &&
      normalized.search === view.search &&
      normalized.region === view.region &&
      normalized.lens === view.lens &&
      normalized.sort === view.sort &&
      view.tags.length === 0
    );
  });

  const currentSummaryTitle =
    activePreset?.kind === "purpose"
      ? `${activePreset.label}で絞り込み中`
      : activePreset?.kind === "city"
        ? `${activePreset.label}の記事を表示中`
        : view.search
          ? `「${view.search}」の検索結果`
          : regionLabel
            ? `${regionLabel}の記事`
            : "記事一覧";

  const hasRefinements =
    Boolean(view.search) ||
    view.category !== "all" ||
    view.topic !== "all" ||
    view.region !== "all" ||
    view.lens !== "all" ||
    view.tags.length > 0 ||
    view.sort !== "recommended";

  const searchPlaceholder = "キーワードで探す...";

  // スケルトンの枚数は、いま表示している件数に合わせる（無ければ控えめに 6 枚）。
  const skeletonCount = posts.length > 0 ? posts.length : 6;

  const renderPreset = (preset: DiscoveryPreset, Icon: typeof Compass) => {
    const isActive = activePreset?.id === preset.id;
    return (
      <button
        key={preset.id}
        // 選択中をもう一度押したら解除（全条件をクリア）。それ以外は適用。
        onClick={() => (isActive ? handleClearAll() : handlePresetSelect(preset))}
        aria-pressed={isActive}
        className={cn(
          "inline-flex items-center gap-1.5 px-3.5 py-1.5",
          PILL_BASE,
          isActive ? PILL_SELECTED : PILL_UNSELECTED,
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

            {/* 検索バー＋詳しく絞り込む（絞り込みは独立した行に置いて役割を明確にする） */}
            <div className="space-y-3">
              <SearchInput
                initialValue={searchParam}
                placeholder={searchPlaceholder}
                maxLength={SEARCH_QUERY_MAX_LENGTH}
                onSearch={handleSearch}
                onReset={handleResetSearch}
              />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <FilterButton
                  variant="prominent"
                  onClick={() => setIsFilterOpen(true)}
                  activeCount={activeFilterCount}
                />
                <span className="text-muted-foreground text-sm">
                  カテゴリ・タグ・記事タイプで詳しく絞り込む
                </span>
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
                    const isActive = view.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        aria-pressed={isActive}
                        className={cn(
                          "px-3.5 py-1.5",
                          PILL_BASE,
                          isActive ? PILL_SELECTED : PILL_UNSELECTED,
                        )}
                      >
                        #{tag}
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
                className="border-border/60 bg-background text-muted-foreground inline-flex w-fit items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium transition-colors hover:border-amber-400"
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

        {/* 結果ヘッダー（ツールバー）。条件変更時はここの先頭へスクロールする
            （scroll-mt で固定ヘッダー分を確保）。
            並び替えは常に同じ位置に固定し、「すべてクリア」は出現しても並び替えを
            動かさないよう別行（右寄せ）に置く。 */}
        <div id="search-results" className="border-border/50 mb-6 scroll-mt-24 border-b pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-baseline gap-3">
              <h2 className="text-foreground text-xl font-bold">{currentSummaryTitle}</h2>
              {totalPosts !== null && (
                <span className="text-muted-foreground text-sm whitespace-nowrap">
                  該当{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-500">{totalPosts}</span>{" "}
                  件
                </span>
              )}
            </div>
            <SortControl value={view.sort} onChange={handleSortChange} />
          </div>

          {hasRefinements && (
            <div className="mt-2 flex justify-end">
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
            </div>
          )}
        </div>

        {isPending ? (
          // 条件変更中はスケルトンを表示（薄色化ではなく読み込み中だと分かるように）
          <section
            aria-busy
            className="mb-12 grid gap-5 md:grid-cols-2 md:gap-6"
            aria-label="読み込み中"
          >
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </section>
        ) : posts.length > 0 ? (
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
              <button onClick={handlePrev} className={cn("px-4 py-2", PILL_BASE, PILL_UNSELECTED)}>
                Prev
              </button>
            )}

            {paginationNumbers.map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="text-muted-foreground px-2">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={cn(
                    "px-4 py-2",
                    PILL_BASE,
                    currentPage === page ? PILL_SELECTED : PILL_UNSELECTED,
                  )}
                >
                  {page}
                </button>
              ),
            )}

            {currentPage < totalPages && (
              <button
                onClick={handleNext}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200",
                  PILL_UNSELECTED,
                )}
              >
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
