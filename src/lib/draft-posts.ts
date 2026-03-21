import { Post, PostMetadata } from "@/types/types";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import { ensureStringArray } from "@/lib/utils";
import { processPostNavigation } from "./posts";
import { getAllPosts } from "./post-metadata";
import * as postFilters from "./post-filters";
import { enrichPostRevenueCategory } from "./revenue";

const draftPostsDirectory = path.join(process.cwd(), "draft-posts");

let cachedDraftPosts: PostMetadata[] | null = null;

const fetchAllDraftPosts = cache((): PostMetadata[] => {
  if (cachedDraftPosts) {
    return cachedDraftPosts;
  }

  if (!fs.existsSync(draftPostsDirectory)) {
    return [];
  }

  const draftFiles = fs
    .readdirSync(draftPostsDirectory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));

  const drafts = draftFiles.map((fileName) => {
    const fullPath = path.join(draftPostsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return enrichPostRevenueCategory({
      slug: fileName.replace(/\.(md|mdx)$/, "").toLowerCase(),
      title: data.title,
      dates: ensureStringArray(data.dates),
      category: data.category,
      excerpt: data.excerpt,
      image: data.image,
      tags: ensureStringArray(data.tags),
      location: ensureStringArray(data.location),
      author: data.author,
      budget: data.budget,
      costs: data.costs,
      series: data.series,
      isPromotion: data.isPromotion,
      promotionPG: ensureStringArray(data.promotionPG),
      journey: data.journey,
      revenueCategory: data.revenueCategory,
      travelTopics: ensureStringArray(data.travelTopics),
    } as PostMetadata);
  });

  cachedDraftPosts = postFilters.sortByDate(drafts);
  return cachedDraftPosts;
});

export const getAllDraftPosts = cache(async (): Promise<PostMetadata[]> => {
  return fetchAllDraftPosts();
});

export const getDraftPostBySlug = cache(async (slug: string): Promise<Post> => {
  let fullPath = path.join(draftPostsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    const matchedFile = fs
      .readdirSync(draftPostsDirectory)
      .find((file) => file.toLowerCase() === `${slug}.md`.toLowerCase());

    if (!matchedFile) {
      throw new Error(`Draft post with slug "${slug}" not found.`);
    }

    fullPath = path.join(draftPostsDirectory, matchedFile);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return enrichPostRevenueCategory({
    slug,
    content,
    title: data.title,
    dates: ensureStringArray(data.dates),
    category: data.category,
    excerpt: data.excerpt,
    image: data.image,
    tags: ensureStringArray(data.tags),
    location: ensureStringArray(data.location),
    author: data.author,
    budget: data.budget,
    costs: data.costs,
    series: data.series,
    isPromotion: data.isPromotion,
    promotionPG: ensureStringArray(data.promotionPG),
    journey: data.journey,
    revenueCategory: data.revenueCategory,
    travelTopics: ensureStringArray(data.travelTopics),
  } as Post);
});

export const getDraftPostData = cache(async (slug: string) => {
  const post = await getDraftPostBySlug(slug);
  const allPosts = await getAllPosts();
  const allDrafts = await getAllDraftPosts();

  return processPostNavigation(slug, post, allPosts, true, allDrafts);
});
