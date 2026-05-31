// markdown.ts
// posts/ と draft-posts/ の .md/.mdx ファイルを読み込み、
// gray-matter でフロントマターを解析して PostMetadata 配列を返す。
// ビルド時と dev 時のどちらでも呼ばれる。

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/types/types";
import { ensureStringArray } from "@/lib/utils";
import { enrichPostRevenueCategory } from "@/lib/revenue";

const postsDirectory = path.join(process.cwd(), "posts");
const draftPostsDirectory = path.join(process.cwd(), "draft-posts");

type PostMetadata = Omit<Post, "content">;

function getRawDataFromDirectory(directory: string): PostMetadata[] {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    console.warn(`Directory not found at ${directory}`);
    return [];
  }

  const fileNames = fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"));

  const allPostsData = fileNames.map((fileName) => {
    // スラッグはファイル名から自動生成する（小文字・拡張子なし）
    const slug = fileName.replace(/\.(md|mdx)$/, "").toLowerCase();
    const fullPath = path.join(directory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return enrichPostRevenueCategory({
      slug,
      title: data.title,
      // 公開日（必須）: フロントマターの publishedAt をそのまま使う
      publishedAt: data.publishedAt || "",
      // 更新日（任意）: 設定されている場合のみセット
      updatedAt: data.updatedAt || undefined,
      // 旅行期間（任意）: { start, end? } のオブジェクト
      travelDates: data.travelDates || undefined,
      category: data.category,
      // SEO 専用説明文（任意）: 省略時は excerpt が代わりに使われる
      description: data.description || undefined,
      excerpt: data.excerpt,
      tags: ensureStringArray(data.tags),
      // アイキャッチ画像パス（任意）
      heroImage: data.heroImage || undefined,
      heroAlt: data.heroAlt || undefined,
      // 地域スラッグ配列（任意）: src/data/region.ts の slug と一致
      regionIds: ensureStringArray(data.regionIds),
      author: data.author,
      // シリーズ情報（任意）: { slug, order? } のオブジェクト
      series: data.series || undefined,
      // 旅程 ID（任意）: src/data/journey.ts の ID と一致
      journeyId: data.journeyId || undefined,
      // 費用レポート（任意）: { budget?, costs? } のオブジェクト
      costReport: data.costReport || undefined,
      // プロモーションプログラム（任意）: 配列が空でも PR 告知は表示しない
      promotionPrograms: ensureStringArray(data.promotionPrograms),
      travelTopics: ensureStringArray(data.travelTopics),
      // 下書きフラグ（任意）: true のままだとビルドキャッシュに含まれない
      draft: data.draft || undefined,
    } as PostMetadata);
  });

  // 同名スラッグが重複した場合は最初のファイルを優先する
  const uniquePostsMap = new Map<string, PostMetadata>();
  allPostsData.forEach((post) => {
    if (!uniquePostsMap.has(post.slug)) {
      uniquePostsMap.set(post.slug, post);
    }
  });

  return Array.from(uniquePostsMap.values());
}

// posts/ ディレクトリ（公開済み記事）を読み込む
export function getRawPostsData(): PostMetadata[] {
  return getRawDataFromDirectory(postsDirectory);
}

// draft-posts/ ディレクトリ（下書き記事）を読み込む
export function getRawDraftPostsData(): PostMetadata[] {
  return getRawDataFromDirectory(draftPostsDirectory);
}
