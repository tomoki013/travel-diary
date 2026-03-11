const fs = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");

const postsDirectory = path.join(process.cwd(), "posts");
const metadataPath = path.join(process.cwd(), ".posts.metadata.json");
const contentPath = path.join(process.cwd(), ".posts.content.json");

function ensureStringArray(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string");
  }

  if (typeof value === "string" && value.trim()) {
    return [value];
  }

  return [];
}

async function generatePostsMetadata() {
  console.log("Generating posts metadata index...");

  try {
    const entries = await fs.readdir(postsDirectory, { withFileTypes: true });
    const postFiles = entries
      .filter(
        (entry) =>
          entry.isFile() &&
          (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
      )
      .map((entry) => entry.name);

    const postsMetadata = [];
    const postsContent = {};

    for (const fileName of postFiles) {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const slug = fileName.replace(/\.(md|mdx)$/, "").toLowerCase();

      postsMetadata.push({
        slug,
        title: data.title || "",
        dates: ensureStringArray(data.dates),
        category: data.category || "",
        excerpt: data.excerpt || "",
        image: data.image || undefined,
        tags: ensureStringArray(data.tags),
        location: ensureStringArray(data.location),
        author: data.author || undefined,
        budget: data.budget,
        costs: data.costs,
        series: data.series || undefined,
        isPromotion: data.isPromotion,
        promotionPG: ensureStringArray(data.promotionPG),
        journey: data.journey || undefined,
        revenueCategory: data.revenueCategory || undefined,
      });

      postsContent[slug] = {
        slug,
        title: data.title || "",
        dates: ensureStringArray(data.dates),
        content,
        category: data.category || "",
        excerpt: data.excerpt || "",
        image: data.image || undefined,
        tags: ensureStringArray(data.tags),
        location: ensureStringArray(data.location),
        author: data.author || undefined,
        budget: data.budget,
        costs: data.costs,
        series: data.series || undefined,
        isPromotion: data.isPromotion,
        promotionPG: ensureStringArray(data.promotionPG),
        journey: data.journey || undefined,
        revenueCategory: data.revenueCategory || undefined,
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
