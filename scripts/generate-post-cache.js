const fs = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");

const postsDirectory = path.join(process.cwd(), "posts");
const cachePath = path.join(process.cwd(), ".posts.cache.json");

/** posts/ 直下の .md/.mdx 記事コンテンツをキャッシュする */
async function generatePostsCache() {
  console.log("Generating posts cache...");
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
      const { content } = matter(fileContents);
      postsCache[slug] = content;
    }

    await fs.writeFile(cachePath, JSON.stringify(postsCache));
    console.log("✅ Successfully generated posts cache at .posts.cache.json");
  } catch (error) {
    console.error("Error generating posts cache:", error);
    process.exit(1);
  }
}

generatePostsCache();
