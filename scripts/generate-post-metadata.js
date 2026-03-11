const fs = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");

const postsDirectory = path.join(process.cwd(), "posts");
const metadataPath = path.join(process.cwd(), ".posts.metadata.json");

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

    for (const fileName of postFiles) {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, "utf8");
      const { data } = matter(fileContents);

      postsMetadata.push({
        slug: fileName.replace(/\.(md|mdx)$/, "").toLowerCase(),
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
    }

    await fs.writeFile(metadataPath, JSON.stringify(postsMetadata));

    const stats = await fs.stat(metadataPath);
    console.log("✅ Posts metadata index generated.");
    console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error("Error generating posts metadata index:", error);
    process.exit(1);
  }
}

generatePostsMetadata();
