"use client";

import { useRef } from "react";

const SAMPLE_CHIPS = [
  "初海外でギリシャに行きたいけど、空港移動が不安。写真も撮りたい。",
  "車なしで行ける関西の日帰り旅を探したい。歩きすぎず、写真も撮れる場所がいい。",
  "雨の日でも楽しめる旅行を探したい。カフェや街歩き中心がいい。",
  "サントリーニとアテネで迷ってる。初海外でも行きやすい方を知りたい。",
  "写真を撮りに行きたい。人混みは避けたい。",
];

export function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChipClick = (chip: string) => {
    onChange(chip);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (!isLoading && value.trim()) onSubmit();
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero text */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-100">
          あなた用の旅行トップを生成する
        </h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          行きたい場所、気になること、不安、条件を自由に書いてください。
          <br className="hidden sm:block" />
          記事・写真・旅行記をもとに、このページ自体を作り替えます。
        </p>
      </div>

      {/* Textarea */}
      <div className="space-y-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="例：初海外でギリシャに行きたいけど、空港移動や島への移動が不安。写真も撮りたい。"
          maxLength={500}
          rows={4}
          disabled={isLoading}
          className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-300 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-zinc-600"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">{value.length} / 500</span>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Cmd+Enter で生成</p>
        </div>
      </div>

      {/* Sample chips */}
      <div className="flex flex-wrap gap-2">
        {SAMPLE_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            disabled={isLoading}
            className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-200"
          >
            {chip.length > 32 ? chip.slice(0, 32) + "…" : chip}
          </button>
        ))}
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!value.trim() || isLoading}
        className="w-full rounded-2xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition hover:opacity-80 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {isLoading ? "生成中…" : "トップページを生成する"}
      </button>

      {/* Transparency notice */}
      <div className="space-y-1 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400">
        <p className="font-medium text-zinc-600 dark:text-zinc-300">このページは実験機能です</p>
        <p>
          入力内容と候補記事情報は、生成のためAI APIに送信されます。
          生成されたUIはサーバーには保存されず、このタブのsessionStorageに一時保存（30分）されます。
        </p>
      </div>
    </div>
  );
}
