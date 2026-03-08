import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/types/types";
import { ensureStringArray } from "@/lib/utils";

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

    return {
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
      journey: data.journey,
    } as PostMetadata;
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
