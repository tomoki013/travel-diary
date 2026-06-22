"use client";

import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  onClick: () => void;
  /** アクティブな絞り込みの数（0 のときバッジ非表示） */
  activeCount?: number;
  className?: string;
  /** 見た目。prominent は目立つ塗りつぶしスタイル（検索セクションの主役向け） */
  variant?: "default" | "prominent";
}

/**
 * 「絞り込み」ボタン。押すと FilterModal を開く。
 * /posts とヘッダー検索オーバーレイで共用する。
 */
export const FilterButton = ({
  onClick,
  activeCount = 0,
  className,
  variant = "default",
}: FilterButtonProps) => {
  const isProminent = variant === "prominent";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all",
        isProminent
          ? "border border-amber-500 bg-amber-500 text-white shadow-[0_1px_8px_-2px_rgba(245,158,11,0.4)] hover:bg-amber-600"
          : "border-border/60 bg-background text-foreground border shadow-sm hover:border-amber-400",
        className,
      )}
      aria-haspopup="dialog"
    >
      <SlidersHorizontal className="h-4 w-4" />
      <span>絞り込み</span>
      {activeCount > 0 && (
        <span
          className={cn(
            "ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded px-1.5 text-xs font-bold",
            isProminent ? "bg-white text-amber-600" : "bg-amber-500 text-white",
          )}
        >
          {activeCount}
        </span>
      )}
    </button>
  );
};

export default FilterButton;
