"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import {
  EMPTY_FILTER,
  FilterValue,
  filterableCategories,
  filterableTopics,
  lensOptions,
  normalizeFilterValue,
} from "@/data/searchFilters";
import { FilterChipGroup } from "./FilterChipGroup";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 現在適用中の絞り込み（モーダルを開いた時の初期値） */
  value: FilterValue;
  /** 「適用」を押したときに確定値を返す */
  onApply: (next: FilterValue) => void;
  /** 表示するタグ候補（維持基準に沿った厳選セット） */
  availableTags: string[];
}

const ANIMATION = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  modal: {
    initial: { y: 24, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 24, opacity: 0 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
} as const;

const buildCountParams = (draft: FilterValue): string | null => {
  const params = new URLSearchParams();
  if (draft.category !== "all") params.set("category", draft.category);
  if (draft.topic !== "all") params.set("topic", draft.topic);
  if (draft.lens !== "all") params.set("lens", draft.lens);
  if (draft.tags.length > 0) params.set("tags", draft.tags.join(","));
  const query = params.toString();
  return query.length > 0 ? query : null;
};

/**
 * 詳細絞り込みモーダル（/posts とヘッダー検索オーバーレイで共用）。
 * 内部に下書き state を持ち、「適用」を押したときだけ onApply を発火する。
 */
const FilterModal = ({ isOpen, onClose, value, onApply, availableTags }: FilterModalProps) => {
  const [draft, setDraft] = useState<FilterValue>(value);
  const [count, setCount] = useState<number | null>(null);

  // 開くたびに現在の適用値で下書きを初期化する
  useEffect(() => {
    if (!isOpen) return;
    const frameId = window.requestAnimationFrame(() => setDraft(value));
    return () => window.cancelAnimationFrame(frameId);
  }, [isOpen, value]);

  // Esc で閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // モーダル表示中は背景（body）のスクロールを禁止する
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const debouncedDraft = useDebounce(draft, 300);

  // 「この条件: N件」のプレビュー件数を取得（失敗時は非表示）
  useEffect(() => {
    if (!isOpen) return;

    const query = buildCountParams(debouncedDraft);
    if (!query) {
      const frameId = window.requestAnimationFrame(() => setCount(null));
      return () => window.cancelAnimationFrame(frameId);
    }

    let cancelled = false;
    fetch(`/api/search?${query}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.total === "number") {
          setCount(data.total);
        }
      })
      .catch(() => {
        if (!cancelled) setCount(null);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedDraft, isOpen]);

  const toggleCategory = (slug: string) =>
    setDraft((prev) => ({
      ...prev,
      category: prev.category === slug ? "all" : slug,
      // カテゴリを観光以外にしたら実用ラベルは解除
      topic: slug !== "tourism" && prev.category !== slug ? "all" : prev.topic,
    }));

  const toggleTopic = (slug: string) =>
    setDraft((prev) =>
      normalizeFilterValue({
        ...prev,
        topic: prev.topic === slug ? "all" : slug,
      }),
    );

  const toggleLens = (slug: string) =>
    setDraft((prev) => ({
      ...prev,
      lens: prev.lens === slug ? "all" : (slug as FilterValue["lens"]),
    }));

  const toggleTag = (tag: string) =>
    setDraft((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));

  const handleClear = () => setDraft(EMPTY_FILTER);

  const handleApply = () => {
    onApply(normalizeFilterValue(draft));
    onClose();
  };

  const tagOptions = availableTags.map((tag) => ({ slug: tag, title: tag }));

  // 何らかの条件が選択されているか（リセットの出し分けに使う）。
  const hasDraft =
    draft.category !== "all" ||
    draft.topic !== "all" ||
    draft.lens !== "all" ||
    draft.tags.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          {...ANIMATION.overlay}
          className="fixed inset-0 z-[120] overflow-y-auto bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <m.div
            {...ANIMATION.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-modal-title"
            className="bg-background relative mx-auto my-10 flex w-full max-w-xl flex-col rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="border-border flex items-center justify-between gap-4 border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="text-muted-foreground h-5 w-5" />
                <h2 id="filter-modal-title" className="font-heading text-lg font-bold">
                  詳しく絞り込む
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="絞り込みを閉じる"
                className="text-muted-foreground hover:bg-accent rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 本体 */}
            <div className="divide-border/60 flex max-h-[60vh] flex-col divide-y overflow-y-auto px-6">
              <div className="py-5">
                <FilterChipGroup
                  title="記事タイプ"
                  description="まずは読み方から。実用情報か、読み物としての旅行記か。"
                  options={lensOptions
                    .filter((option) => option.value !== "all")
                    .map((option) => ({ slug: option.value, title: option.label }))}
                  selected={draft.lens === "all" ? null : draft.lens}
                  onToggle={toggleLens}
                />
              </div>
              <div className="py-5">
                <FilterChipGroup
                  title="記事カテゴリ"
                  description="記事の種類で絞り込みます（観光情報・旅程・シリーズなど）。"
                  options={filterableCategories}
                  selected={draft.category === "all" ? null : draft.category}
                  onToggle={toggleCategory}
                />
              </div>
              <div className="py-5">
                <FilterChipGroup
                  title="実用ラベル"
                  description="お金・交通・ビザなど、知りたい実務トピックで絞り込みます（観光情報が対象）。"
                  options={filterableTopics}
                  selected={draft.topic === "all" ? null : draft.topic}
                  onToggle={toggleTopic}
                />
              </div>
              {tagOptions.length > 0 && (
                <div className="py-5">
                  <FilterChipGroup
                    title="タグ"
                    description="旅の定番テーマから選べます（複数選択でき、すべてを含む記事に絞ります）。"
                    options={tagOptions}
                    selected={draft.tags}
                    onToggle={toggleTag}
                  />
                </div>
              )}
            </div>

            {/* フッター（モバイルは縦積み、PC は横並び） */}
            <div className="border-border flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center">
              {count !== null && (
                <div className="text-muted-foreground text-sm">
                  この条件: <span className="text-foreground font-bold">{count}件</span>
                </div>
              )}
              <div className="flex items-center gap-2 sm:ml-auto">
                {hasDraft && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="flex-1 sm:flex-none"
                  >
                    リセット
                  </Button>
                )}
                <Button type="button" onClick={handleApply} className="flex-1 sm:flex-none">
                  適用する
                </Button>
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;
