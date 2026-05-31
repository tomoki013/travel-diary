// @ts-check
const fs = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");

const postsDirectory = path.join(process.cwd(), "posts");
const outputPath = path.join(process.cwd(), "public", "generated", "blog-index.json");

function ensureStringArray(value) {
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string");
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

async function generateBlogIndex() {
  console.log("Generating public/generated/blog-index.json...");

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const entries = await fs.readdir(postsDirectory, { withFileTypes: true });
  const postFiles = entries
    .filter((e) => e.isFile() && /\.(md|mdx)$/.test(e.name))
    .map((e) => e.name);

  const articles = [];

  for (const fileName of postFiles) {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data } = matter(fileContents);

    if (!data.title) continue;

    const slug = fileName.replace(/\.(md|mdx)$/, "").toLowerCase();
    const seriesSlug =
      data.series && typeof data.series === "object" ? data.series.slug : undefined;

    // Derive themes from category, tags, travelTopics
    const themes = [
      ...ensureStringArray(data.tags),
      ...ensureStringArray(data.travelTopics),
      data.category,
      seriesSlug,
    ].filter(Boolean);

    // Build a safe AI summary from excerpt (max 120 chars)
    const excerpt = (data.excerpt || "").replace(/\s+/g, " ").trim();
    const summaryForAI = excerpt.length > 120 ? excerpt.slice(0, 117) + "..." : excerpt;

    const regionIds = ensureStringArray(data.regionIds);

    articles.push({
      id: slug,
      slug,
      title: data.title,
      summaryForAI,
      themes: [...new Set(themes)],
      tags: ensureStringArray(data.tags),
      area: regionIds[0] || undefined,
      country: deriveCountry(regionIds),
      city: regionIds[0] || undefined,
      heroImageId: data.heroImage || undefined,
      category: data.category || undefined,
      series: seriesSlug || undefined,
      publishedAt: data.publishedAt || undefined,
    });
  }

  const output = {
    version: "1.0",
    generatedAt: new Date().toISOString(),
    count: articles.length,
    articles,
  };

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), "utf8");
  console.log(`✅ Generated ${articles.length} articles → ${outputPath}`);
}

function deriveCountry(locations) {
  const map = {
    athens: "greece",
    santorini: "greece",
    greece: "greece",
    bangkok: "thailand",
    thailand: "thailand",
    kyoto: "japan",
    osaka: "japan",
    tokyo: "japan",
    nara: "japan",
    japan: "japan",
    madrid: "spain",
    barcelona: "spain",
    toledo: "spain",
    spain: "spain",
    paris: "france",
    france: "france",
    brussels: "belgium",
    belgium: "belgium",
    istanbul: "turkey",
    turkey: "turkey",
    cairo: "egypt",
    aswan: "egypt",
    egypt: "egypt",
    singapore: "singapore",
    malaysia: "malaysia",
    vietnam: "vietnam",
    china: "china",
    india: "india",
  };
  for (const loc of locations) {
    const c = map[loc.toLowerCase()];
    if (c) return c;
  }
  return undefined;
}

generateBlogIndex().catch((e) => {
  console.error("Failed to generate blog index:", e);
  process.exit(1);
});
