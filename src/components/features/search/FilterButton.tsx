"use client";

import { SlidersHorizontal } from "lucide-react";

interface FilterButtonProps {
  onClick: () => void;
  /** アクティブな絞り込みの数（0 のときバッジ非表示） */
  activeCount?: number;
  className?: string;
}

/**
 * 「絞り込み」ボタン。押すと FilterModal を開く。
 * /posts とヘッダー検索オーバーレイで共用する。
 */
export const FilterButton = ({ onClick, activeCount = 0, className }: FilterButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`border-border/60 bg-background text-foreground hover:border-foreground/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-colors ${
      className ?? ""
    }`}
    aria-haspopup="dialog"
  >
    <SlidersHorizontal className="h-4 w-4" />
    <span>絞り込み</span>
    {activeCount > 0 && (
      <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
        {activeCount}
      </span>
    )}
  </button>
);

export default FilterButton;
