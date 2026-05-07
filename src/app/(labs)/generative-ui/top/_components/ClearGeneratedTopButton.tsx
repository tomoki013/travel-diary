"use client";

import { clearGeneratedTop } from "@/features/generative-ui/top/sessionStorage";

export function ClearGeneratedTopButton({
  onClear,
  variant = "default",
}: {
  onClear: () => void;
  variant?: "default" | "compact";
}) {
  const handleClear = () => {
    clearGeneratedTop();
    onClear();
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleClear}
        className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 underline transition"
      >
        削除する
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClear}
      className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline transition"
    >
      生成データを削除
    </button>
  );
}
