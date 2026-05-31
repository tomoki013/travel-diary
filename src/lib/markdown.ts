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
    const slug = fileName.replace(/\.(md|mdx)$/, "").toLowerCase();
    const fullPath = path.join(directory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return enrichPostRevenueCategory({
      slug,
      title: data.title,
      publishedAt: data.publishedAt || "",
      updatedAt: data.updatedAt || undefined,
      travelDates: data.travelDates || undefined,
      category: data.category,
      description: data.description || undefined,
      excerpt: data.excerpt,
      tags: ensureStringArray(data.tags),
      heroImage: data.heroImage || undefined,
      heroAlt: data.heroAlt || undefined,
      regionIds: ensureStringArray(data.regionIds),
      author: data.author,
      series: data.series || undefined,
      journeyId: data.journeyId || undefined,
      costReport: data.costReport || undefined,
      promotionPrograms: ensureStringArray(data.promotionPrograms),
      travelTopics: ensureStringArray(data.travelTopics),
      draft: data.draft || undefined,
    } as PostMetadata);
  });

  // Deduplicate posts based on slug
  const uniquePostsMap = new Map<string, PostMetadata>();
  allPostsData.forEach((post) => {
    if (!uniquePostsMap.has(post.slug)) {
      uniquePostsMap.set(post.slug, post);
    }
  });

  return Array.from(uniquePostsMap.values());
}

export function getRawPostsData(): PostMetadata[] {
  return getRawDataFromDirectory(postsDirectory);
}

export function getRawDraftPostsData(): PostMetadata[] {
  return getRawDataFromDirectory(draftPostsDirectory);
}
