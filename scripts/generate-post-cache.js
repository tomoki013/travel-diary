const fs = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");

const postsDirectory = path.join(process.cwd(), "posts");
const cachePath = path.join(process.cwd(), ".posts.cache.json");

/** 
 * AIの要約に最低限必要な情報のみを抽出する（超軽量版）
 */
function extractEssentialContent(content) {
  // 1. 画像、リンク、HTMLコメント、装飾を徹底的に除去
  let stripped = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // 画像
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // リンク
    .replace(/<[^>]*>/g, '') // HTMLタグ
    .replace(/<!--[\s\S]*?-->/g, '') // コメント
    .replace(/[\*\_\~]/g, ''); // 太字・斜体など

  // 2. 重要な行（見出し、リスト）を優先的に抽出し、通常の文章は短縮
  const lines = stripped.split('\n');
  const essentialLines = [];
  let currentLength = 0;
  const MAX_PER_POST = 600; // 1記事あたりの上限文字数

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // 見出し、リスト、テーブルは情報を凝縮しているため優先
    const isPriority = trimmed.startsWith('#') || trimmed.startsWith('-') || trimmed.startsWith('|') || /^\d+\./.test(trimmed);
    
    if (isPriority || currentLength < MAX_PER_POST) {
      essentialLines.push(trimmed);
      currentLength += trimmed.length;
    }
    
    if (currentLength >= MAX_PER_POST && !isPriority) break;
  }

  return essentialLines.join('\n').slice(0, MAX_PER_POST);
}

async function generatePostsCache() {
  console.log("Generating ultra-optimized posts cache...");
  try {
    const entries = await fs.readdir(postsDirectory, { withFileTypes: true });
    const postFiles = entries
      .filter(entry => entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")))
      .map(entry => entry.name);

    const postsCache = {};

    for (const fileName of postFiles) {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, "utf8");
      const { content, data } = matter(fileContents);
      
      // AIプランナーに関連性の高いカテゴリのみキャッシュ（オプション）
      // tourism, itinerary, series 以外はスキップしても良いが、一旦全てを軽量化して含める
      
      const slug = fileName.replace(/\.(md|mdx)$/, "").toLowerCase();
      const optimized = extractEssentialContent(content);
      
      postsCache[slug] = `Title: ${data.title}\n${optimized}`;
    }

    // JSONをミニファイして保存
    await fs.writeFile(cachePath, JSON.stringify(postsCache));
    
    const stats = await fs.stat(cachePath);
    console.log(`✅ Ultra-optimized cache generated.`);
    console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB (Previous was ~400KB)`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

generatePostsCache();
