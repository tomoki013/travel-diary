import { cache } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getRawPostsData, getRawDraftPostsData } from "./markdown";
import * as postFilters from "./post-filters";
import { Post } from "@/types/types";
import { ensureStringArray } from "@/lib/utils";
import { calculateScores } from "@/lib/search";
import { enrichPostRevenueCategory, getNextActionPosts } from "@/lib/revenue";

type PostMetadata = Omit<Post, "content">;

let cachedPosts: PostMetadata[] | null = null;
let cachedDraftPosts: PostMetadata[] | null = null;

const fetchAllPosts = cache((): PostMetadata[] => {
  if (cachedPosts) {
    return cachedPosts;
  }
  const posts = getRawPostsData();
  cachedPosts = postFilters.sortByDate(posts);
  return cachedPosts;
});

const fetchAllDraftPosts = cache((): PostMetadata[] => {
  if (cachedDraftPosts) {
    return cachedDraftPosts;
  }
  const posts = getRawDraftPostsData();
  cachedDraftPosts = postFilters.sortByDate(posts);
  return cachedDraftPosts;
});

type GetAllPostsOptions = {
  category?: string;
  series?: string;
  tag?: string;
  region?: string[];
  journey?: string;
  limit?: number;
};
/**
 * Gets all post metadata and processes it based on options.
 */
export const getAllPosts = cache(
  async (options: GetAllPostsOptions = {}): Promise<PostMetadata[]> => {
    let posts = fetchAllPosts();

    if (options.category) {
      posts = postFilters.filterByCategory(posts, options.category);
    }
    if (options.series) {
      posts = postFilters.filterBySeries(posts, options.series);
    }
    if (options.tag) {
      posts = postFilters.filterByTag(posts, options.tag);
    }
    if (options.region) {
      posts = postFilters.getRegionPosts(posts, options.region);
    }
    if (options.journey) {
      posts = posts.filter((p) => p.journey === options.journey);
    }

    let sortedPosts = postFilters.sortByDate(posts);
    if (options.limit) {
      sortedPosts = sortedPosts.slice(0, options.limit);
    }

    return sortedPosts;
  }
);

/**
 * Gets all draft posts metadata.
 */
export const getAllDraftPosts = cache(async (): Promise<PostMetadata[]> => {
  return fetchAllDraftPosts();
});

/**
 * Generic function to get a post data (including raw Markdown content) based on the slug and directory.
 */
async function getPostFromDirectory(
  slug: string,
  directory: string
): Promise<Post> {
  const postsDirectory = path.join(process.cwd(), directory);
  let fullPath = path.join(postsDirectory, `${slug}.md`);

  // Check if the file exists
  if (!fs.existsSync(fullPath)) {
    // Case-insensitive fallback
    if (fs.existsSync(postsDirectory)) {
      const allFiles = fs.readdirSync(postsDirectory);
      const matchedFile = allFiles.find(
        (file) => file.toLowerCase() === `${slug}.md`.toLowerCase()
      );

      if (matchedFile) {
        fullPath = path.join(postsDirectory, matchedFile);
      } else {
        throw new Error(`Post with slug "${slug}" not found in ${directory}.`);
      }
    } else {
      throw new Error(`Directory ${directory} not found.`);
    }
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return enrichPostRevenueCategory({
    slug,
    content,
    title: data.title,
    dates: ensureStringArray(data.dates),
    category: data.category,
    // Pass through other properties
    excerpt: data.excerpt,
    image: data.image,
    tags: ensureStringArray(data.tags),
    location: ensureStringArray(data.location),
    author: data.author,
    budget: data.budget,
    costs: data.costs,
    series: data.series,
    isPromotion: data.isPromotion,
    promotionPG: data.promotionPG,
    journey: data.journey,
    revenueCategory: data.revenueCategory,
  } as Post);
}

/**
 * Gets a single post data based on the slug.
 */
export const getPostBySlug = cache(async (slug: string): Promise<Post> => {
  return getPostFromDirectory(slug, "posts");
});

/**
 * Gets a single draft post data based on the slug.
 */
export const getDraftPostBySlug = cache(async (slug: string): Promise<Post> => {
  return getPostFromDirectory(slug, "draft-posts");
});

/**
 * Gets all the necessary data for a single post page.
 */
export const getPostData = cache(async (slug: string) => {
  const post = await getPostBySlug(slug);

  if (!post) {
    throw new Error(`Post with slug "${slug}" not found.`);
  }

  const allPosts = await getAllPosts();
  return processPostNavigation(slug, post, allPosts);
});

/**
 * Gets all the necessary data for a single draft post page.
 */
export const getDraftPostData = cache(async (slug: string) => {
  const post = await getDraftPostBySlug(slug);

  if (!post) {
    throw new Error(`Draft post with slug "${slug}" not found.`);
  }

  const allPosts = await getAllPosts(); // We use actual posts for navigation if needed, or maybe all drafts?
  // User wants it to look the same, so maybe navigation should work within drafts?
  // But navigation usually links to /posts/. Let's use drafts for navigation if we're in preview mode.
  const allDrafts = await getAllDraftPosts();

  return processPostNavigation(slug, post, allPosts, true, allDrafts);
});

async function processPostNavigation(
  slug: string,
  post: Post,
  allPosts: PostMetadata[],
  isPreview: boolean = false,
  allDrafts: PostMetadata[] = []
) {
  const navigationPosts = isPreview ? allDrafts : allPosts;
  const baseUrl = isPreview ? "/preview" : "/posts";

  // --- Category-specific navigation ---
  let previousCategoryPost, nextCategoryPost;
  if (
    post.category === "itinerary" ||
    post.category === "tourism" ||
    post.category === "one-off"
  ) {
    const categoryPosts = postFilters.filterByCategory(
      navigationPosts,
      post.category
    );
    const previousCategoryPostData = postFilters.getPreviousPost(
      slug,
      categoryPosts
    );
    const nextCategoryPostData = postFilters.getNextPost(slug, categoryPosts);

    if (previousCategoryPostData) {
      previousCategoryPost = {
        href: `${baseUrl}/${previousCategoryPostData.slug}`,
        title: previousCategoryPostData.title,
      };
    }
    if (nextCategoryPostData) {
      nextCategoryPost = {
        href: `${baseUrl}/${nextCategoryPostData.slug}`,
        title: nextCategoryPostData.title,
      };
    }
  }

  // --- Series-specific navigation ---
  let previousSeriesPost, nextSeriesPost;
  if (post.series) {
    const seriesPosts = navigationPosts.filter((p) => p.series === post.series);
    const previousSeriesPostData = postFilters.getPreviousPost(
      slug,
      seriesPosts
    );
    const nextSeriesPostData = postFilters.getNextPost(slug, seriesPosts);

    if (previousSeriesPostData) {
      previousSeriesPost = {
        href: `${baseUrl}/${previousSeriesPostData.slug}`,
        title: previousSeriesPostData.title,
      };
    }
    if (nextSeriesPostData) {
      nextSeriesPost = {
        href: `${baseUrl}/${nextSeriesPostData.slug}`,
        title: nextSeriesPostData.title,
      };
    }
  }

  const previousPostData = postFilters.getPreviousPost(slug, navigationPosts);
  const nextPostData = postFilters.getNextPost(slug, navigationPosts);

  let regionRelatedPosts: PostMetadata[] = [];
  if (post.location && post.location.length > 0) {
    // Related posts always come from actual posts
    const regionPosts = await getAllPosts({ region: post.location });
    // Exclude the current post itself (only if it's not a draft, but for simplicity we filter by slug)
    const filteredRegionPosts = regionPosts.filter((p) => p.slug !== post.slug);

    const query = [
      post.title,
      post.excerpt,
      post.category,
      ...(post.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    const weights = {
      tags: 10,
      title: 5,
      excerpt: 2,
      category: 2,
    };

    const scoredPosts = calculateScores(filteredRegionPosts, query, weights, [
      "title",
      "excerpt",
      "category",
      "tags",
    ]);

    regionRelatedPosts = scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((sp) => sp.post);
  }


  const nextActionPosts = getNextActionPosts(post, allPosts);

  // Format the next/previous post data to match the expected structure in the component
  const previousPost = previousPostData
    ? {
        href: `${baseUrl}/${previousPostData.slug}`,
        title: previousPostData.title,
      }
    : undefined;

  const nextPost = nextPostData
    ? {
        href: `${baseUrl}/${nextPostData.slug}`,
        title: nextPostData.title,
      }
    : undefined;

  return {
    post,
    previousPost,
    nextPost,
    regionRelatedPosts,
    allPosts, // For use in CustomLink component
    previousCategoryPost,
    nextCategoryPost,
    previousSeriesPost,
    nextSeriesPost,
    nextActionPosts,
  };
}
