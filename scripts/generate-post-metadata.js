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

function extractHeadings(content) {
  const lines = content.split("\n");
  const headings = [];

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.*)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim().replace(/[*_]/g, ""); // Remove basic markdown decoration
      const escapedText = text.replace(/\s+/g, "-");
      // Use simpler ID logic to match CustomMarkdown or at least be stable
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
      const headings = extractHeadings(content);

      const metadata = {
        slug,
        title: data.title || "",
        publishedAt: data.publishedAt || "",
        updatedAt: data.updatedAt || undefined,
        travelDates: data.travelDates || undefined,
        category: data.category || "",
        description: data.description || undefined,
        excerpt: data.excerpt || "",
        tags: ensureStringArray(data.tags),
        heroImage: data.heroImage || undefined,
        heroAlt: data.heroAlt || undefined,
        regionIds: ensureStringArray(data.regionIds),
        author: data.author || undefined,
        series: data.series || undefined,
        journeyId: data.journeyId || undefined,
        costReport: data.costReport || undefined,
        promotionPrograms: ensureStringArray(data.promotionPrograms),
        travelTopics: ensureStringArray(data.travelTopics),
        draft: data.draft || undefined,
      };

      postsMetadata.push(metadata);

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
