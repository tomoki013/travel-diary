import { cache } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getRawPostsData } from "./markdown";
import * as postFilters from "./post-filters";
import { Post } from "@/types/types";
import { ensureStringArray } from "@/lib/utils";
import { calculateScores } from "@/lib/search";

type PostMetadata = Omit<Post, "content">;

let cachedPosts: PostMetadata[] | null = null;

const fetchAllPosts = cache((): PostMetadata[] => {
  if (cachedPosts) {
    return cachedPosts;
  }
  const posts = getRawPostsData();
  cachedPosts = postFilters.sortByDate(posts);
  return cachedPosts;
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
 * Gets a single post data (including raw Markdown content) based on the slug.
 */
export const getPostBySlug = cache(async (slug: string): Promise<Post> => {
  const postsDirectory = path.join(process.cwd(), "posts");
  let fullPath = path.join(postsDirectory, `${slug}.md`);

  // Check if the file exists
  if (!fs.existsSync(fullPath)) {
    // Case-insensitive fallback
    const allFiles = fs.readdirSync(postsDirectory);
    const matchedFile = allFiles.find(
      (file) => file.toLowerCase() === `${slug}.md`.toLowerCase()
    );

    if (matchedFile) {
      fullPath = path.join(postsDirectory, matchedFile);
    } else {
      throw new Error(`Post with slug "${slug}" not found.`);
    }
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
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
  } as Post;
});

/**
 * Gets all the necessary data for a single post page.
 */
export const getPostData = cache(async (slug: string) => {
  const post = await getPostBySlug(slug);

  if (!post) {
    // 意図的にエラーを発生させ、page.tsxのcatchに渡す
    throw new Error(`Post with slug "${slug}" not found.`);
  }

  const allPosts = await getAllPosts();

  // --- Category-specific navigation ---
  let previousCategoryPost, nextCategoryPost;
  if (
    post.category === "itinerary" ||
    post.category === "tourism" ||
    post.category === "one-off"
  ) {
    const categoryPosts = postFilters.filterByCategory(allPosts, post.category);
    const previousCategoryPostData = postFilters.getPreviousPost(
      slug,
      categoryPosts
    );
    const nextCategoryPostData = postFilters.getNextPost(slug, categoryPosts);

    if (previousCategoryPostData) {
      previousCategoryPost = {
        href: `/posts/${previousCategoryPostData.slug}`,
        title: previousCategoryPostData.title,
      };
    }
    if (nextCategoryPostData) {
      nextCategoryPost = {
        href: `/posts/${nextCategoryPostData.slug}`,
        title: nextCategoryPostData.title,
      };
    }
  }

  // --- Series-specific navigation ---
  let previousSeriesPost, nextSeriesPost;
  if (post.series) {
    const seriesPosts = allPosts.filter((p) => p.series === post.series);
    const previousSeriesPostData = postFilters.getPreviousPost(
      slug,
      seriesPosts
    );
    const nextSeriesPostData = postFilters.getNextPost(slug, seriesPosts);

    if (previousSeriesPostData) {
      previousSeriesPost = {
        href: `/posts/${previousSeriesPostData.slug}`,
        title: previousSeriesPostData.title,
      };
    }
    if (nextSeriesPostData) {
      nextSeriesPost = {
        href: `/posts/${nextSeriesPostData.slug}`,
        title: nextSeriesPostData.title,
      };
    }
  }

  const previousPostData = postFilters.getPreviousPost(slug, allPosts);
  const nextPostData = postFilters.getNextPost(slug, allPosts);

  let regionRelatedPosts: PostMetadata[] = [];
  if (post.location && post.location.length > 0) {
    const regionPosts = await getAllPosts({ region: post.location });
    // Exclude the current post itself
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

  // Format the next/previous post data to match the expected structure in the component
  const previousPost = previousPostData
    ? {
        href: `/posts/${previousPostData.slug}`,
        title: previousPostData.title,
      }
    : undefined;

  const nextPost = nextPostData
    ? {
        href: `/posts/${nextPostData.slug}`,
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
  };
});
