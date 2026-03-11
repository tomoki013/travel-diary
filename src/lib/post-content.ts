import { Post } from "@/types/types";
import fs from "fs/promises";
import path from "path";
import { cache } from "react";
import { enrichPostRevenueCategory } from "./revenue";

const postsContentPath = path.join(process.cwd(), ".posts.content.json");

let cachedPostsBySlug: Record<string, Post> | null = null;

const loadPostsContent = cache(async (): Promise<Record<string, Post>> => {
  if (cachedPostsBySlug) {
    return cachedPostsBySlug;
  }

  const data = await fs.readFile(postsContentPath, "utf8");
  const parsed = JSON.parse(data) as Record<string, Post>;
  cachedPostsBySlug = Object.fromEntries(
    Object.entries(parsed).map(([slug, post]) => [slug, enrichPostRevenueCategory(post)])
  );

  return cachedPostsBySlug;
});

export const getPublishedPostBySlug = cache(async (slug: string): Promise<Post> => {
  const postsBySlug = await loadPostsContent();
  const post = postsBySlug[slug.toLowerCase()];

  if (!post) {
    throw new Error(`Post with slug "${slug}" not found.`);
  }

  return post;
});
