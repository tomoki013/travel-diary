// generate-post-metadata.js
// posts/ ディレクトリの .md/.mdx ファイルを読み込み、
// ビルド時に使うキャッシュファイルを2種類生成する。
//   .posts.metadata.json  : 本文なしのメタデータ一覧（一覧ページ・フィルタリング用）
//   .posts.content.json   : 本文・見出し込みの完全データ（記事詳細ページ用）
// draft: true の記事はどちらのキャッシュにも含めない。

const fs = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");

const postsDirectory = path.join(process.cwd(), "posts");
const metadataPath = path.join(process.cwd(), ".posts.metadata.json");
const contentPath = path.join(process.cwd(), ".posts.content.json");

// 文字列・配列・undefined を受け取り、文字列配列に正規化する
function ensureStringArray(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string");
  }

  if (typeof value === "string" && value.trim()) {
    return [value];
  }

  return [];
}

// Markdown 本文から H2/H3 見出しを抽出して目次データを作る
function extractHeadings(content) {
  const lines = content.split("\n");
  const headings = [];

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.*)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim().replace(/[*_]/g, "");
      const escapedText = text.replace(/\s+/g, "-");
      const id = escapedText;
      headings.push({ id, text, level });
    }
  }
  return headings;
}

async function generatePostsMetadata() {
  console.log("Generating posts metadata index...");

  try {
    const entries = await fs.readdir(postsDirectory, { withFileTypes: true });
    const postFiles = entries
      .filter(
        (entry) => entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")),
      )
      .map((entry) => entry.name);

    const postsMetadata = [];
    const postsContent = {};

    for (const fileName of postFiles) {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const slug = fileName.replace(/\.(md|mdx)$/, "").toLowerCase();

      // draft: true の記事はキャッシュに含めない（公開されない）
      if (data.draft === true) {
        continue;
      }

      const headings = extractHeadings(content);

      // 新しいフロントマタースキーマに従ってフィールドをマッピングする
      const metadata = {
        slug,
        // タイトル（必須）
        title: data.title || "",
        // 公開日（必須）: YYYY-MM-DD 形式
        publishedAt: data.publishedAt || "",
        // 更新日（任意）
        updatedAt: data.updatedAt || undefined,
        // 旅行期間（任意）: { start, end? }
        travelDates: data.travelDates || undefined,
        // カテゴリ（必須）: tourism / itinerary / series / one-off
        category: data.category || "",
        // SEO 用説明文（任意）
        description: data.description || undefined,
        // 一覧表示用の要約（任意）
        excerpt: data.excerpt || "",
        // タグ（任意）
        tags: ensureStringArray(data.tags),
        // アイキャッチ画像パス（任意）
        heroImage: data.heroImage || undefined,
        // アイキャッチ画像 alt（任意）
        heroAlt: data.heroAlt || undefined,
        // 地域スラッグ配列（任意）: src/data/region.ts の slug と一致
        regionIds: ensureStringArray(data.regionIds),
        // 著者名（任意）
        author: data.author || undefined,
        // シリーズ情報（任意）: { slug, order? }
        series: data.series || undefined,
        // 旅程 ID（任意）: src/data/journey.ts の ID と一致
        journeyId: data.journeyId || undefined,
        // 費用レポート（任意）: { budget?, costs? }
        costReport: data.costReport || undefined,
        // プロモーションプログラム（任意）: PR 記事のみ設定
        promotionPrograms: ensureStringArray(data.promotionPrograms),
        // 実用情報ラベル（任意）: category: tourism のみ
        travelTopics: ensureStringArray(data.travelTopics),
      };

      postsMetadata.push(metadata);

      // コンテンツキャッシュには本文と見出しも含める
      postsContent[slug] = {
        ...metadata,
        content,
        headings,
      };
    }

    await Promise.all([
      fs.writeFile(metadataPath, JSON.stringify(postsMetadata)),
      fs.writeFile(contentPath, JSON.stringify(postsContent)),
    ]);

    const [metadataStats, contentStats] = await Promise.all([
      fs.stat(metadataPath),
      fs.stat(contentPath),
    ]);
    console.log("✅ Posts metadata index generated.");
    console.log(`   Metadata size: ${(metadataStats.size / 1024).toFixed(2)} KB`);
    console.log(`   Content size: ${(contentStats.size / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error("Error generating posts metadata index:", error);
    process.exit(1);
  }
}

generatePostsMetadata();
