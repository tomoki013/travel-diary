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
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 sm:flex-row sm:items-center dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
      <p className="flex-1 text-xs">
        前回このタブで生成したトップを復元しました。
        {userInputPreview && (
          <span className="text-zinc-400 dark:text-zinc-500">（「{userInputPreview}」）</span>
        )}
      </p>
      <div className="flex flex-shrink-0 items-center gap-3">
        <ClearGeneratedTopButton onClear={onClear} variant="compact" />
        <button
          type="button"
          onClick={onNew}
          className="text-xs text-zinc-600 underline transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          新しく作る
        </button>
      </div>
    </div>
  );
}
