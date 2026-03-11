import { cache } from "react";
import * as postFilters from "./post-filters";
import { Post, PostMetadata } from "@/types/types";
import { calculateScores } from "@/lib/search";
import { getNextActionPosts } from "@/lib/revenue";
import { getAllPosts } from "./post-metadata";
import { getPublishedPostBySlug } from "./post-content";

export { getAllPosts } from "./post-metadata";

/**
 * Gets a single post data based on the slug.
 */
export const getPostBySlug = cache(async (slug: string): Promise<Post> => {
  return getPublishedPostBySlug(slug);
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

export async function processPostNavigation(
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
