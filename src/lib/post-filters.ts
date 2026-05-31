import { Post, TravelTopic } from "@/types/types";
import { getRegionAndDescendantSlugs } from "@/lib/regionUtil";

type PostMetadata = Omit<Post, "content">;

export function sortByDate(posts: PostMetadata[]): PostMetadata[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();

    if (dateB !== dateA) {
      return dateB - dateA;
    }

    return a.slug < b.slug ? -1 : 1;
  });
}

export function filterByCategory(posts: PostMetadata[], category: string): PostMetadata[] {
  return posts.filter((post) => post.category === category);
}

export function filterBySeries(posts: PostMetadata[], series: string): PostMetadata[] {
  return posts.filter((post) => post.series?.slug === series);
}

export function filterByTag(posts: PostMetadata[], tag: string): PostMetadata[] {
  // `tags` is now guaranteed to be an array by the data layer.
  return posts.filter((post) => post.tags && post.tags.includes(tag));
}

export function filterByTravelTopic(posts: PostMetadata[], topic: TravelTopic): PostMetadata[] {
  return posts.filter((post) => post.travelTopics?.includes(topic));
}

/**
 * 指定された記事の次の記事を取得します。
 * @param slug 現在の記事のスラッグ
 * @param allPosts - **日付で降順にソート済みの**記事配列。
 */
export function getNextPost(slug: string, allPosts: PostMetadata[]): PostMetadata | null {
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  if (currentIndex === -1 || currentIndex === 0) {
    return null; // No next post if it's the first one or not found
  }
  return allPosts[currentIndex - 1];
}

/**
 * 指定された記事の前の記事を取得します。
 * @param slug 現在の記事のスラッグ
 * @param allPosts - **日付で降順にソート済みの**記事配列。
 */
export function getPreviousPost(slug: string, allPosts: PostMetadata[]): PostMetadata | null {
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  if (currentIndex === -1 || currentIndex === allPosts.length - 1) {
    return null; // No previous post if it's the last one or not found
  }
  return allPosts[currentIndex + 1];
}

export function getRegionPosts(posts: PostMetadata[], targetSlugs: string[]): PostMetadata[] {
  // 指定 slug の子孫（都市など）も含めて展開する
  // 例: ["malaysia"] → ["malaysia", "kuala-lumpur", "penang", ...]
  const expandedSlugs = new Set(targetSlugs.flatMap(getRegionAndDescendantSlugs));
  return posts.filter(
    (post) => post.regionIds && post.regionIds.some((loc) => expandedSlugs.has(loc)),
  );
}
