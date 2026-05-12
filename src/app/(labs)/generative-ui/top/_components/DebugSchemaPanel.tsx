"use client";

import { useState } from "react";
import type { GeneratedTopPage } from "@/features/generative-ui/top/schema";

export function DebugSchemaPanel({
  schema,
  expiresAt,
}: {
  schema: GeneratedTopPage;
  expiresAt?: number;
}) {
  const [open, setOpen] = useState(false);

  const debugInfo = {
    generationId: schema.generationId,
    schemaVersion: schema.schemaVersion,
    layoutType: schema.layoutType,
    sectionsCount: schema.sections.length,
    usedArticleIds: schema.usedArticleIds,
    warnings: schema.warnings,
    storageExpiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-zinc-400 underline transition hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
      >
        {open ? "Debug Schemaを閉じる" : "Debug Schemaを表示"}
      </button>

      {open && (
        <div className="mt-3 space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="space-y-1">
            <p className="font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
              Debug Info
            </p>
            <pre className="overflow-x-auto font-mono text-xs whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          <div className="space-y-1">
            <p className="font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
              Full Schema (sections preview)
            </p>
            <pre className="max-h-64 overflow-x-auto font-mono text-xs whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {JSON.stringify(schema.sections, null, 2)}
            </pre>
          </div>

          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            ※ APIキーやprompt内容はここに含まれません
          </p>
        </div>
      )}
    </div>
  );
}
