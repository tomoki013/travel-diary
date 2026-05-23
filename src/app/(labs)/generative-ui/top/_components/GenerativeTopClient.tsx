"use client";

import { useState, useEffect, useCallback } from "react";
import type { GeneratedTopPage } from "@/features/generative-ui/top/schema";
import {
  GenerateTopResponseSchema,
  PatchTopResponseSchema,
} from "@/features/generative-ui/top/schema";
import type { ArticleIndex } from "@/features/generative-ui/top/renderer";
import {
  saveGeneratedTop,
  loadGeneratedTop,
  clearGeneratedTop,
} from "@/features/generative-ui/top/sessionStorage";
import { buildFallbackSchema } from "@/features/generative-ui/top/fallbackSchema";
import { PromptInput } from "./PromptInput";
import { LoadingSteps } from "./LoadingSteps";
import { GeneratedTopView } from "./GeneratedTopView";
import { SessionStorageNotice } from "./SessionStorageNotice";

type UIState =
  | { phase: "input" }
  | { phase: "loading" }
  | {
      phase: "result";
      schema: GeneratedTopPage;
      expiresAt?: number;
      restored?: boolean;
      userInputPreview?: string;
    };

export function GenerativeTopClient({ articleIndex }: { articleIndex: ArticleIndex }) {
  const [ui, setUi] = useState<UIState>({ phase: "input" });
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Restore from sessionStorage on mount
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const stored = loadGeneratedTop();
      if (stored) {
        setUi({
          phase: "result",
          schema: stored.schema,
          expiresAt: stored.expiresAt,
          restored: true,
          userInputPreview: stored.userInputPreview,
        });
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!inputValue.trim()) return;
    setError(null);
    setUi({ phase: "loading" });

    try {
      const res = await fetch("/api/generative-ui/top/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: inputValue.trim().slice(0, 500),
          locale: "ja",
          device: window.innerWidth < 768 ? "mobile" : "desktop",
        }),
      });

      if (!res.ok) {
        const fallback = buildFallbackSchema("生成に失敗しました。もう一度試してください。");
        setUi({ phase: "result", schema: fallback });
        return;
      }

      const data = await res.json();

      // Validate API response on client side too
      const parsed = GenerateTopResponseSchema.safeParse(data);
      const schema = parsed.success ? parsed.data.schema : buildFallbackSchema();

      saveGeneratedTop(
        schema,
        inputValue.trim(),
        parsed.success ? parsed.data.meta.articleIndexVersion : undefined,
      );

      const stored = loadGeneratedTop();
      setUi({
        phase: "result",
        schema,
        expiresAt: stored?.expiresAt,
        userInputPreview: inputValue.trim().slice(0, 80),
      });
    } catch {
      const fallback = buildFallbackSchema("ネットワークエラーが発生しました。");
      setUi({ phase: "result", schema: fallback });
    }
  }, [inputValue]);

  const handlePatch = useCallback(
    async (instruction: string) => {
      if (ui.phase !== "result") return;
      const currentSchema = ui.schema;

      const res = await fetch("/api/generative-ui/top/patch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction: instruction.slice(0, 300),
          currentSchema,
        }),
      });

      if (!res.ok) throw new Error("Patch failed");

      const data = await res.json();
      const parsed = PatchTopResponseSchema.safeParse(data);
      if (!parsed.success) throw new Error("Invalid patch response");

      const schema = parsed.data.schema;
      saveGeneratedTop(schema, ui.userInputPreview ?? "", undefined);
      const stored = loadGeneratedTop();

      setUi({
        phase: "result",
        schema,
        expiresAt: stored?.expiresAt,
        userInputPreview: ui.userInputPreview,
      });
    },
    [ui],
  );

  const handleClear = useCallback(() => {
    clearGeneratedTop();
    setUi({ phase: "input" });
    setInputValue("");
    setError(null);
  }, []);

  const handleNew = useCallback(() => {
    clearGeneratedTop();
    setUi({ phase: "input" });
    setInputValue("");
    setError(null);
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      {ui.phase === "input" && (
        <PromptInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleGenerate}
          isLoading={false}
        />
      )}

      {ui.phase === "loading" && <LoadingSteps />}

      {ui.phase === "result" && (
        <>
          {ui.restored && (
            <SessionStorageNotice
              userInputPreview={ui.userInputPreview ?? ""}
              onClear={handleClear}
              onNew={handleNew}
            />
          )}
          <GeneratedTopView
            schema={ui.schema}
            articleIndex={articleIndex}
            expiresAt={ui.expiresAt}
            onClear={handleClear}
            onPatch={handlePatch}
          />
        </>
      )}

      {error && <p className="text-center text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}
