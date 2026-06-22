import { Post, TravelTopic } from "@/types/types";
import { LensKey, SortKey, normalizeFilterValue } from "@/data/searchFilters";
import { filterPostsBySearch, calculateScores } from "@/lib/search";
import { filterByLens, getSortedPosts } from "@/lib/post-discovery";
import { filterByTag } from "@/lib/post-filters";
import { getRegionAndDescendantSlugs } from "@/lib/regionUtil";

type PostMetadata = Omit<Post, "content">;

/** 検索クエリの最大文字数（/api/search と /posts で共通）。 */
export const SEARCH_QUERY_MAX_LENGTH = 100;

export interface SearchPostsOptions {
  /** キーワード（フレーズ・除外語・OR 構文に対応） */
  query?: string;
  /** PostType | "all" */
  category?: string;
  /** TravelTopic | "all" */
  topic?: string;
  /** 記事タイプ */
  lens?: LensKey;
  /** 厳選タグ（AND 条件） */
  tags?: string[];
  /** 地域 slug（子孫地域も展開）| "all" */
  region?: string;
  /** query が無いときの並び替え。query があるときはスコア順を優先する。 */
  sort?: SortKey;
}

export interface SearchPostsResult {
  posts: PostMetadata[];
  total: number;
}

/**
 * 記事の検索・絞り込み・並び替えを一手に担う共通サービス。
 *
 * `/api/search`（候補表示・件数プレビュー）と `/posts`（記事一覧）が
 * **同じ条件・同じ適用順** で結果を得るための単一の入口。フィルタの適用順、
 * topic→tourism の正規化、キーワードの文字数制限はすべてここに集約する。
 *
 * 適用順:
 *   1. カテゴリ → 2. 実用ラベル(topic) → 3. 地域 → 4. 記事タイプ(lens) → 5. タグ
 *   6. キーワード（あればスコア順 / なければ sort で並び替え）
 */
export const searchPosts = (
  posts: PostMetadata[],
  options: SearchPostsOptions,
): SearchPostsResult => {
  const {
    query = "",
    category = "all",
    topic = "all",
    lens = "all",
    tags = [],
    region = "all",
    sort = "recommended",
  } = options;

  // topic を選んだら tourism に寄せる（絞り込みの正規化ルールを踏襲）
  const normalized = normalizeFilterValue({ category, topic, lens, tags });

  let result = posts;

  if (normalized.category !== "all") {
    result = result.filter((post) => post.category === normalized.category);
  }

  if (normalized.topic !== "all") {
    result = result.filter((post) => post.travelTopics?.includes(normalized.topic as TravelTopic));
  }

  if (region !== "all") {
    // 指定リージョンの子孫（都市など）も含めて展開してフィルタリングする
    const regionSlugs = getRegionAndDescendantSlugs(region);
    result = result.filter((post) => post.regionIds?.some((id) => regionSlugs.includes(id)));
  }

  if (normalized.lens !== "all") {
    result = filterByLens(result, normalized.lens);
  }

  for (const tag of normalized.tags) {
    result = filterByTag(result, tag);
  }

  const trimmedQuery = query.trim().slice(0, SEARCH_QUERY_MAX_LENGTH);

  if (trimmedQuery) {
    const filteredBySearch = filterPostsBySearch(result, trimmedQuery);
    const scored = calculateScores(filteredBySearch, trimmedQuery);
    result = scored.sort((a, b) => b.score - a.score).map((item) => item.post);
  } else {
    result = getSortedPosts(result, sort);
  }

  return { posts: result, total: result.length };
};
