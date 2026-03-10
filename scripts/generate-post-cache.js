const fs = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");

const postsDirectory = path.join(process.cwd(), "posts");
const cachePath = path.join(process.cwd(), ".posts.cache.json");

/** 
 * AIの要約に最低限必要な情報（見出し、箇条書き、重要キーワードを含む段落）のみを抽出する
 */
function extractEssentialContent(content) {
  // 1. 不要なHTMLタグやマークダウンの装飾（画像リンクなど）を簡易的に除去
  let stripped = content.replace(/!\[.*?\]\(.*?\)/g, ''); // 画像
  stripped = stripped.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // リンク（テキストのみ残す）
  
  // 2. 行ごとに分割して重要な行のみを残す
  const lines = stripped.split('\n');
  const essentialLines = lines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    
    // 見出しは重要
    if (trimmed.startsWith('#')) return true;
    // リスト項目は重要（具体的なスポット名などが多いため）
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\./.test(trimmed)) return true;
    // 表の行も重要（費用や場所の情報が多いため）
    if (trimmed.startsWith('|')) return true;
    
    // 挨拶や定型文を避ける
    if (trimmed.includes('こんにちは') || trimmed.includes('いかがでしたか')) return false;
    
    // それ以外の段落も、ある程度の長さがあれば残す（AIの文脈用）
    // ただし長すぎる場合は制限する
    return trimmed.length > 5;
  });

  // 3. 最大文字数を制限（1記事あたり約1000文字程度に抑える）
  return essentialLines.join('\n').slice(0, 2000);
}

/** posts/ 直下の .md/.mdx 記事コンテンツを軽量化してキャッシュする */
async function generatePostsCache() {
  console.log("Generating optimized posts cache...");
  try {
    const entries = await fs.readdir(postsDirectory, { withFileTypes: true });
    const postFiles = entries
      .filter(
        (entry) =>
          entry.isFile() &&
          (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
      )
      .map((entry) => entry.name);

    const postsCache = {};

    for (const fileName of postFiles) {
      const slug = fileName.replace(/\.(md|mdx)$/, "").toLowerCase();
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, "utf8");
      const { content, data } = matter(fileContents);
      
      // コンテンツを軽量化
      const optimizedContent = extractEssentialContent(content);
      
      // AIが文脈を理解しやすいようにタイトルも付与
      postsCache[slug] = `Title: ${data.title}\n\n${optimizedContent}`;
    }

    await fs.writeFile(cachePath, JSON.stringify(postsCache));
    const stats = await fs.stat(cachePath);
    console.log(`✅ Successfully generated optimized posts cache at .posts.cache.json`);
    console.log(`   Final Size: ${(stats.size / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error("Error generating posts cache:", error);
    process.exit(1);
  }
}

generatePostsCache();
