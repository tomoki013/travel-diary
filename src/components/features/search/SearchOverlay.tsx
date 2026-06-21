"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Loader2, SearchIcon, XIcon } from "lucide-react";
import { LoadingAnimation } from "../LoadingAnimation/LoadingAnimation";
import { LinkCard } from "@/components/common/LinkCard";
import { useSearchOverlay } from "@/hooks/useSearchOverlay";
import { SEARCH_CONFIG } from "@/constants/searchConfig";
import { FILTERABLE_TAGS, FilterValue } from "@/data/searchFilters";
import { FilterButton } from "./FilterButton";
import FilterModal from "./FilterModal";

// 型定義
type Suggestion = {
  title: string;
  slug: string;
};

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /** 絞り込みに表示するタグ候補（維持基準に沿った厳選セット） */
  availableTags?: string[];
}

// アニメーション設定
const ANIMATION_CONFIG = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  modal: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
} as const;

/**
 * 検索候補表示コンポーネント
 */
const SearchSuggestions = ({
  searchTerm,
  suggestions,
  isLoading,
  hasActiveFilter,
  executeSearch,
  onClose,
  totalResults,
}: {
  searchTerm: string;
  suggestions: Suggestion[];
  isLoading: boolean;
  hasActiveFilter: boolean;
  executeSearch: () => void;
  onClose: () => void;
  totalResults: number | null;
}) => {
  const canShowComponent = searchTerm.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH || hasActiveFilter;

  const displayedSuggestions = suggestions.slice(0, SEARCH_CONFIG.MAX_SUGGESTIONS);

  const showSeeAllButton = suggestions.length > SEARCH_CONFIG.MAX_SUGGESTIONS;

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (!canShowComponent) return null;

  return (
    <div className="bg-background border-border mt-4 rounded-lg border shadow-lg">
      {isLoading && <LoadingAnimation variant="luggageCarousel" />}

      {!isLoading && totalResults !== null && (
        <div className="text-muted-foreground border-border border-b p-3 text-sm">
          検索結果: {totalResults}件
        </div>
      )}

      {!isLoading && displayedSuggestions.length > 0 && (
        <m.ul variants={listVariants} initial="hidden" animate="visible" exit="hidden">
          {displayedSuggestions.map((post) => (
            <m.li key={post.slug} variants={itemVariants} onTap={onClose}>
              <LinkCard href={`/posts/${post.slug}`} title={post.title} variant="minimal" />
            </m.li>
          ))}
        </m.ul>
      )}

      {!isLoading && showSeeAllButton && (
        <div className="border-border border-t p-2">
          <Button variant="ghost" className="w-full" onClick={executeSearch}>
            すべての結果を見る
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {!isLoading &&
        suggestions.length === 0 &&
        (searchTerm || hasActiveFilter) &&
        totalResults === 0 && (
          <div className="text-muted-foreground p-4">
            一致する記事は見つかりませんでした。
            <br />
            キーワードを変えて再度お試しください。
          </div>
        )}
    </div>
  );
};

/**
 * メインのSearchOverlayコンポーネント
 */
const SearchOverlay = ({
  isOpen,
  onClose,
  availableTags = FILTERABLE_TAGS,
}: SearchOverlayProps) => {
  const {
    searchTerm,
    setSearchTerm,
    filter,
    applyFilter,
    activeFilterCount,
    suggestions,
    totalResults,
    isLoading,
    executeSearch,
    handleKeyDown,
  } = useSearchOverlay({ onClose });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApply = (next: FilterValue) => {
    applyFilter(next);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          {...ANIMATION_CONFIG.overlay}
          className="fixed inset-0 z-[110] overflow-y-auto bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <m.div
            {...ANIMATION_CONFIG.modal}
            className="bg-background relative mx-auto mt-20 w-full max-w-2xl rounded-lg p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 閉じるボタン */}
            <button
              onClick={onClose}
              className="text-muted-foreground hover:bg-accent absolute top-4 right-4 rounded-full p-2 transition-colors"
              aria-label="検索を閉じる"
            >
              <XIcon className="h-6 w-6" />
            </button>

            <div className="flex flex-col gap-6">
              <h2 className="font-heading text-2xl font-bold">ブログ検索</h2>

              {/* キーワード検索 */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="キーワードを入力..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow"
                    autoFocus
                    aria-label="検索キーワード"
                  />
                  <Button onClick={executeSearch} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <SearchIcon className="mr-2 h-5 w-5" />
                    )}
                    {isLoading ? "検索中..." : "検索"}
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground px-2 text-xs">
                ヒント: 「&quot;絶景&quot;」のように囲むとフレーズ検索、-除外したい単語 も使えます。
              </p>

              {/* 絞り込み（ボタン → モーダル） */}
              <div className="flex items-center gap-3">
                <FilterButton
                  onClick={() => setIsFilterOpen(true)}
                  activeCount={activeFilterCount}
                />
                <span className="text-muted-foreground text-sm">
                  カテゴリ・タグなどで詳しく絞り込めます
                </span>
              </div>
            </div>

            {/* 検索候補 */}
            <SearchSuggestions
              searchTerm={searchTerm}
              suggestions={suggestions}
              isLoading={isLoading}
              hasActiveFilter={activeFilterCount > 0}
              executeSearch={executeSearch}
              onClose={onClose}
              totalResults={totalResults}
            />
          </m.div>

          {/* 詳細絞り込みモーダル（/posts と共用） */}
          <FilterModal
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            value={filter}
            onApply={handleApply}
            availableTags={availableTags}
          />
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
