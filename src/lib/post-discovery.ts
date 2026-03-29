import { getRegionPath } from "./regionUtil";
import { Post, TravelTopic } from "@/types/types";

type PostMetadata = Omit<Post, "content">;

export type BlogDiscoveryView =
  | "recommended"
  | "new"
  | "practical"
  | "diary";

const ENTRY_TOPIC_SCORES: Record<TravelTopic, number> = {
  transport: 26,
  booking: 22,
  visa: 20,
  money: 18,
  sim: 12,
  insurance: 10,
};

const DIARY_CATEGORIES = new Set(["series", "itinerary"]);

const getTimestamp = (dates?: string[]) =>
  new Date(dates?.[0] || "1970-01-01").getTime();

const countOverlap = (left: string[] = [], right: string[] = []) => {
  const rightSet = new Set(right.map((value) => value.toLowerCase()));
  return left.filter((value) => rightSet.has(value.toLowerCase())).length;
};

const getMonthsOld = (post: PostMetadata) => {
  const timestamp = getTimestamp(post.dates);
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  return diffMs / (1000 * 60 * 60 * 24 * 30);
};

const getPrimaryLocation = (post: PostMetadata) =>
  post.location?.[0]?.toLowerCase().trim();

const getLocationDepth = (slug: string) => getRegionPath(slug).length;

const getIntroKeywordScore = (post: PostMetadata) => {
  const corpus = `${post.title} ${post.excerpt || ""}`;
  let score = 0;

  if (/初めて|はじめて|初心者/u.test(corpus)) score += 22;
  if (/全体像|まとめ|比較|使い方|選び方|行き方|アクセス|注意点/u.test(corpus)) score += 16;
  if (/空港/u.test(corpus)) score += 14;
  if (/交通|移動/u.test(corpus)) score += 10;
  if (/観光|見どころ/u.test(corpus)) score += 6;

  return score;
};

export const isPracticalPost = (post: PostMetadata) =>
  post.category === "tourism" && (post.travelTopics?.length || 0) > 0;

export const getPostEntryScore = (post: PostMetadata) => {
  let score = 0;

  if (post.category === "tourism") score += 48;
  if (post.category === "itinerary") score += 14;
  if (post.category === "series") score -= 22;
  if (post.category === "one-off") score -= 12;
  if (post.revenueCategory === "essay") score -= 10;

  for (const topic of post.travelTopics || []) {
    score += ENTRY_TOPIC_SCORES[topic] || 0;
  }

  score += getIntroKeywordScore(post);

  if (post.tags?.includes("初海外")) score += 24;
  if (post.tags?.includes("空港アクセス")) score += 18;
  if (post.tags?.includes("交通情報")) score += 12;
  if (post.location?.length) score += 8;
  if (post.journey) score += 6;

  const primaryLocation = getPrimaryLocation(post);
  if (primaryLocation) {
    const depth = getLocationDepth(primaryLocation);
    if (depth >= 3) score += 12;
    if (depth === 2) score += 8;
    if (depth === 0) score += 6;
  }

  const monthsOld = getMonthsOld(post);
  score += Math.max(0, 10 - Math.floor(monthsOld / 2));

  return score;
};

const sortByDateDesc = (posts: PostMetadata[]) =>
  [...posts].sort((left, right) => getTimestamp(right.dates) - getTimestamp(left.dates));

export const getRecommendedPosts = (posts: PostMetadata[]) =>
  [...posts].sort((left, right) => {
    const scoreDiff = getPostEntryScore(right) - getPostEntryScore(left);
    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    return getTimestamp(right.dates) - getTimestamp(left.dates);
  });

const takeDiversePosts = (posts: PostMetadata[], limit: number) => {
  const selected: PostMetadata[] = [];
  const seenPrimaryLocations = new Set<string>();
  const remainder: PostMetadata[] = [];

  for (const post of posts) {
    const primaryLocation = getPrimaryLocation(post);

    if (!primaryLocation || !seenPrimaryLocations.has(primaryLocation)) {
      selected.push(post);
      if (primaryLocation) {
        seenPrimaryLocations.add(primaryLocation);
      }
    } else {
      remainder.push(post);
    }

    if (selected.length === limit) {
      return selected;
    }
  }

  for (const post of remainder) {
    selected.push(post);
    if (selected.length === limit) {
      break;
    }
  }

  return selected;
};

export const getHomepageEntryPosts = (posts: PostMetadata[], limit: number = 4) => {
  const candidates = posts.filter(
    (post) =>
      isPracticalPost(post) ||
      post.tags?.includes("初海外") ||
      /全体像|まとめ|初めて|比較/u.test(`${post.title} ${post.excerpt || ""}`),
  );

  return takeDiversePosts(getRecommendedPosts(candidates), limit);
};

export const getPostsForView = (
  posts: PostMetadata[],
  view: BlogDiscoveryView,
) => {
  switch (view) {
    case "practical":
      return getRecommendedPosts(posts.filter(isPracticalPost));
    case "diary":
      return sortByDateDesc(posts.filter((post) => DIARY_CATEGORIES.has(post.category)));
    case "new":
      return sortByDateDesc(posts);
    case "recommended":
    default:
      return getRecommendedPosts(posts);
  }
};

export const getPostDiscoveryNote = (post: PostMetadata) => {
  if (post.tags?.includes("初海外")) {
    return "初海外向け";
  }

  if (post.category === "tourism" && post.travelTopics?.includes("transport")) {
    return "移動前に読みたい";
  }

  if (post.category === "tourism" && post.travelTopics?.length) {
    return "実用重視";
  }

  if (post.category === "itinerary") {
    return "旅程ベース";
  }

  if (post.category === "series") {
    return "旅行記";
  }

  if (post.category === "one-off") {
    return "旅の考え方";
  }

  return undefined;
};

type GeoContext = {
  raw: Set<string>;
  cities: Set<string>;
  countries: Set<string>;
  locationDepths: Map<string, number>;
};

const buildGeoContext = (post: Pick<PostMetadata, "location">): GeoContext => {
  const raw = new Set<string>();
  const cities = new Set<string>();
  const countries = new Set<string>();
  const locationDepths = new Map<string, number>();

  for (const value of post.location || []) {
    const slug = value.toLowerCase().trim();
    if (!slug) continue;

    raw.add(slug);
    const path = getRegionPath(slug);
    const depth = path.length;
    locationDepths.set(slug, depth);

    if (depth >= 3) {
      cities.add(slug);
      countries.add(path[1].slug);
    } else if (depth === 2) {
      countries.add(slug);
    }
  }

  return {
    raw,
    cities,
    countries,
    locationDepths,
  };
};

export const getGeoRelationship = (
  current: Pick<PostMetadata, "location">,
  candidate: Pick<PostMetadata, "location">,
) => {
  const currentContext = buildGeoContext(current);
  const candidateContext = buildGeoContext(candidate);

  let exactSpecificMatches = 0;
  let exactCountryMatches = 0;
  let exactGenericMatches = 0;

  for (const slug of candidateContext.raw) {
    if (!currentContext.raw.has(slug)) {
      continue;
    }

    const depth = Math.max(
      currentContext.locationDepths.get(slug) || 0,
      candidateContext.locationDepths.get(slug) || 0,
    );

    if (depth >= 3) {
      exactSpecificMatches += 1;
    } else if (depth === 2) {
      exactCountryMatches += 1;
    } else {
      exactGenericMatches += 1;
    }
  }

  const sharedCountryMatches = [...candidateContext.countries].filter((country) =>
    currentContext.countries.has(country),
  ).length;

  const score =
    exactSpecificMatches * 72 +
    exactCountryMatches * 44 +
    exactGenericMatches * 54 +
    sharedCountryMatches * 26;

  return {
    score,
    sameSpecificLocation: exactSpecificMatches > 0 || exactGenericMatches > 0,
    sameCountry: exactCountryMatches > 0 || sharedCountryMatches > 0,
  };
};

export const getContextualRelatedPosts = (
  current: PostMetadata,
  allPosts: PostMetadata[],
  limit: number = 3,
) => {
  const currentTopics = current.travelTopics || [];
  const currentTags = current.tags || [];

  return allPosts
    .filter((post) => post.slug !== current.slug)
    .map((post) => {
      const geo = getGeoRelationship(current, post);
      const sharedTopics = countOverlap(currentTopics, post.travelTopics || []);
      const sharedTags = countOverlap(currentTags, post.tags || []);
      const sameSeries = Boolean(current.series && current.series === post.series);
      const sameJourney = Boolean(current.journey && current.journey === post.journey);
      const sameCategory = current.category === post.category;
      const sameRevenueCategory =
        Boolean(current.revenueCategory) &&
        current.revenueCategory === post.revenueCategory;

      let score = geo.score;
      score += sharedTopics * 24;
      score += sameJourney ? 22 : 0;
      score += sameSeries ? 20 : 0;
      score += sameRevenueCategory ? 16 : 0;
      score += sameCategory ? 10 : 0;
      score += sharedTags * 4;

      if (current.category === "tourism" && post.category === "series" && geo.score < 40) {
        score -= 18;
      }

      const hasContext =
        geo.score > 0 ||
        sharedTopics > 0 ||
        sameSeries ||
        sameJourney ||
        sameRevenueCategory;

      if (!hasContext || score < 18) {
        return null;
      }

      return {
        post,
        score,
        timestamp: getTimestamp(post.dates),
      };
    })
    .filter(
      (
        item,
      ): item is {
        post: PostMetadata;
        score: number;
        timestamp: number;
      } => Boolean(item),
    )
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return right.timestamp - left.timestamp;
    })
    .slice(0, limit)
    .map(({ post }) => post);
};
