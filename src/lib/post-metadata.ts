import { PostMetadata, TravelTopic } from "@/types/types";
import fs from "fs/promises";
import path from "path";
import { cache } from "react";
import * as postFilters from "./post-filters";
import { enrichPostRevenueCategory } from "./revenue";

export type GetAllPostsOptions = {
  category?: string;
  series?: string;
  tag?: string;
  region?: string[];
  journey?: string;
  topic?: TravelTopic;
  limit?: number;
};

const postsMetadataPath = path.join(process.cwd(), ".posts.metadata.json");
let cachedPosts: PostMetadata[] | null = null;

const loadPostsMetadata = cache(async (): Promise<PostMetadata[]> => {
  if (cachedPosts) {
    return cachedPosts;
  }

  const data = await fs.readFile(postsMetadataPath, "utf8");
  const parsed = JSON.parse(data) as PostMetadata[];
  cachedPosts = postFilters.sortByDate(parsed.map(enrichPostRevenueCategory));
  return cachedPosts;
});

export const getAllPosts = cache(
  async (options: GetAllPostsOptions = {}): Promise<PostMetadata[]> => {
    let posts = await loadPostsMetadata();

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
      posts = posts.filter((post) => post.journey === options.journey);
    }
    if (options.topic) {
      posts = postFilters.filterByTravelTopic(posts, options.topic);
    }

    let sortedPosts = postFilters.sortByDate(posts);
    if (options.limit) {
      sortedPosts = sortedPosts.slice(0, options.limit);
    }

    return sortedPosts;
  }
);
