import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/types/types";
import { ensureStringArray } from "@/lib/utils";
import { enrichPostRevenueCategory } from "@/lib/revenue";

const postsDirectory = path.join(process.cwd(), "posts");

type PostMetadata = Omit<Post, "content">;

export function getRawPostsData(): PostMetadata[] {
  if (!fs.existsSync(postsDirectory) || !fs.statSync(postsDirectory).isDirectory()) {
    console.warn(`Posts directory not found at ${postsDirectory}`);
    return [];
  }

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"));

  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.(md|mdx)$/, "").toLowerCase();
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return enrichPostRevenueCategory({
      slug,
      title: data.title,
      dates: ensureStringArray(data.dates),
      category: data.category,
      tags: ensureStringArray(data.tags),
      excerpt: data.excerpt,
      image: data.image,
      location: ensureStringArray(data.location),
      author: data.author,
      budget: data.budget,
      costs: data.costs,
      series: data.series,
      isPromotion: data.isPromotion,
      promotionPG: data.promotionPG,
      revenueCategory: data.revenueCategory,
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
