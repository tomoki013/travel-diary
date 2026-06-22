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
        "inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold shadow-sm transition-colors",
        isProminent
          ? "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent"
          : "border-border/60 bg-background text-foreground hover:border-amber-400",
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
            isProminent ? "bg-primary-foreground text-primary" : "bg-amber-500 text-white",
          )}
        >
          {activeCount}
        </span>
      )}
    </button>
  );
};

export default FilterButton;
