import fs from "fs/promises";
import path from "path";
import type { Metadata } from "next";
import { GenerativeTopClient } from "./_components/GenerativeTopClient";
import type { ArticleIndex } from "@/features/generative-ui/top/renderer";

export const metadata: Metadata = {
  title: "旅行トップを生成する（実験機能）| ともきちの旅行日記",
  description:
    "あなたの旅行目的に合わせてブログトップページをAIが生成する実験ページです。",
  robots: { index: false, follow: false },
};

const BLOG_INDEX_PATH = path.join(process.cwd(), "public", "generated", "blog-index.json");

async function loadArticleIndex(): Promise<ArticleIndex> {
  try {
    const raw = await fs.readFile(BLOG_INDEX_PATH, "utf8");
    const index = JSON.parse(raw) as {
      articles: Array<{
        id: string;
        slug: string;
        title: string;
        summaryForAI: string;
        heroImageId?: string;
      }>;
    };
    return Object.fromEntries(
      index.articles.map((a) => [
        a.id,
        {
          slug: a.slug,
          title: a.title,
          summaryForAI: a.summaryForAI,
          heroImageId: a.heroImageId,
        },
      ])
    );
  } catch {
    return {};
  }
}

export default async function GenerativeUiTopPage() {
  const articleIndex = await loadArticleIndex();

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 flex items-center gap-3">
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-semibold">
          実験
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Generative UI Top — このページはAIが生成する実験機能です
        </span>
      </div>

      <GenerativeTopClient articleIndex={articleIndex} />
    </main>
  );
}
