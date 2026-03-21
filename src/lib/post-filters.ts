import { Post, TravelTopic } from "@/types/types";

type PostMetadata = Omit<Post, "content">;

export function sortByDate(posts: PostMetadata[]): PostMetadata[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.dates[0]).getTime();
    const dateB = new Date(b.dates[0]).getTime();

    if (dateB !== dateA) {
      return dateB - dateA;
    }

    return b.dates.length - a.dates.length;
  });
}

export function filterByCategory(
  posts: PostMetadata[],
  category: string
): PostMetadata[] {
  return posts.filter((post) => post.category === category);
}

export function filterBySeries(
  posts: PostMetadata[],
  series: string
): PostMetadata[] {
  return posts.filter((post) => post.series === series);
}

export function filterByTag(
  posts: PostMetadata[],
  tag: string
): PostMetadata[] {
  // `tags` is now guaranteed to be an array by the data layer.
  return posts.filter((post) => post.tags && post.tags.includes(tag));
}

export function filterByTravelTopic(
  posts: PostMetadata[],
  topic: TravelTopic
): PostMetadata[] {
  return posts.filter((post) => post.travelTopics?.includes(topic));
}

/**
 * 指定された記事の次の記事を取得します。
 * @param slug 現在の記事のスラッグ
 * @param allPosts - **日付で降順にソート済みの**記事配列。
 */
export function getNextPost(
  slug: string,
  allPosts: PostMetadata[],
): PostMetadata | null {
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
export function getPreviousPost(
  slug: string,
  allPosts: PostMetadata[],
): PostMetadata | null {
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  if (currentIndex === -1 || currentIndex === allPosts.length - 1) {
    return null; // No previous post if it's the last one or not found
  }
  return allPosts[currentIndex + 1];
}

export function getRegionPosts(
  posts: PostMetadata[],
  targetSlugs: string[]
): PostMetadata[] {
  return posts.filter(
    (post) =>
      post.location && post.location.some((loc) => targetSlugs.includes(loc))
  );
}
