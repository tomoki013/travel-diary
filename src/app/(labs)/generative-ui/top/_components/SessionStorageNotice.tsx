"use client";

import { ClearGeneratedTopButton } from "./ClearGeneratedTopButton";

export function SessionStorageNotice({
  userInputPreview,
  onClear,
  onNew,
}: {
  userInputPreview: string;
  onClear: () => void;
  onNew: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400">
      <p className="flex-1 text-xs">
        前回このタブで生成したトップを復元しました。
        {userInputPreview && (
          <span className="text-zinc-400 dark:text-zinc-500">（「{userInputPreview}」）</span>
        )}
      </p>
      <div className="flex items-center gap-3 flex-shrink-0">
        <ClearGeneratedTopButton onClear={onClear} variant="compact" />
        <button
          type="button"
          onClick={onNew}
          className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline transition"
        >
          新しく作る
        </button>
      </div>
    </div>
  );
}
