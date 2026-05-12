"use client";

import { useState } from "react";
import type { GeneratedTopPage } from "@/features/generative-ui/top/schema";
import type { ArticleIndex } from "@/features/generative-ui/top/renderer";
import { PrimitiveRenderer } from "@/features/generative-ui/top/renderer";
import { ClearGeneratedTopButton } from "./ClearGeneratedTopButton";
import { DebugSchemaPanel } from "./DebugSchemaPanel";

const PATCH_SUGGESTIONS = [
  "もっと写真重視にして",
  "車なし前提にして",
  "初海外向けを強くして",
  "予算低めにして",
  "雨の日でも行ける方向にして",
];

export function GeneratedTopView({
  schema,
  articleIndex,
  expiresAt,
  onClear,
  onPatch,
}: {
  schema: GeneratedTopPage;
  articleIndex: ArticleIndex;
  expiresAt?: number;
  onClear: () => void;
  onPatch: (instruction: string) => Promise<void>;
}) {
  const [patchInput, setPatchInput] = useState("");
  const [isPatching, setIsPatching] = useState(false);
  const [patchError, setPatchError] = useState<string | null>(null);

  const handlePatch = async (instruction: string) => {
    if (!instruction.trim() || isPatching) return;
    setIsPatching(true);
    setPatchError(null);
    try {
      await onPatch(instruction.trim());
      setPatchInput("");
    } catch {
      setPatchError("更新に失敗しました。もう一度試してください。");
    } finally {
      setIsPatching(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page title + reason */}
      <div className="space-y-3">
        <h1 className="text-2xl leading-tight font-bold text-zinc-900 sm:text-3xl dark:text-zinc-100">
          {schema.pageTitle}
        </h1>
        {schema.designReason && (
          <div className="flex items-start gap-2 rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
            <span className="mt-0.5 flex-shrink-0 text-xs text-zinc-400">💭</span>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {schema.designReason}
            </p>
          </div>
        )}
      </div>

      {/* Generated UI */}
      <PrimitiveRenderer schema={schema} articleIndex={articleIndex} />

      {/* Patch form */}
      <section className="space-y-4 border-t border-zinc-100 pt-6 dark:border-zinc-800">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          このトップをどう変えますか？
        </h2>

        <div className="flex flex-wrap gap-2">
          {PATCH_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setPatchInput(s)}
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={patchInput}
            onChange={(e) => setPatchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handlePatch(patchInput);
              }
            }}
            placeholder="例：もっと写真重視にして"
            maxLength={300}
            disabled={isPatching}
            className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-300 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-zinc-600"
          />
          <button
            type="button"
            onClick={() => handlePatch(patchInput)}
            disabled={!patchInput.trim() || isPatching}
            className="flex-shrink-0 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-80 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {isPatching ? "更新中…" : "更新する"}
          </button>
        </div>

        {patchError && <p className="text-xs text-red-500 dark:text-red-400">{patchError}</p>}
      </section>

      {/* Footer actions */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <ClearGeneratedTopButton onClear={onClear} />
      </div>

      <DebugSchemaPanel schema={schema} expiresAt={expiresAt} />
    </div>
  );
}
