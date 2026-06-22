import { getAllPosts } from "@/lib/post-metadata";
import BlogClient from "./Client";
import { POSTS_PER_PAGE } from "@/constants/constants";
import { filterPostsBySearch, calculateScores } from "@/lib/search";
import { TravelTopic } from "@/types/types";
import { filterByLens, getSortedPosts } from "@/lib/post-discovery";
import { filterByTag } from "@/lib/post-filters";
import { FILTERABLE_TAGS, LensKey, SortKey, isLensKey, isSortKey } from "@/data/searchFilters";
import { getRegionAndDescendantSlugs } from "@/lib/regionUtil";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "全記事一覧 - Blog ",
  description:
    "「ともきちの旅行日記」の記事一覧です。新着だけでなく、初めて読む人向けのおすすめ、実用情報、旅行記から入口を選べます。",
  path: "/posts",
});

const normalizeFilters = (
  category: string,
  topic: TravelTopic | "all",
): { category: string; topic: TravelTopic | "all" } => {
  let nextCategory = category;
  const nextTopic = topic;

  if (nextTopic !== "all") {
    nextCategory = "tourism";
  }

  return {
    category: nextCategory,
    topic: nextTopic,
  };
};

/**
 * 並び替え（sort）と記事タイプ（lens）を解決する。
 * 旧 `view` パラメータ（recommended/new/practical/diary）からのリンクも壊れないようマップする。
 */
const resolveSortAndLens = (
  rawSort: string | undefined,
  rawLens: string | undefined,
  rawView: string | undefined,
): { sort: SortKey; lens: LensKey } => {
  let sort: SortKey = rawSort && isSortKey(rawSort) ? rawSort : "recommended";
  let lens: LensKey = rawLens && isLensKey(rawLens) ? rawLens : "all";

  // 後方互換: 旧 view パラメータを sort / lens に振り分ける
  if (!rawSort && !rawLens && rawView) {
    if (rawView === "new") {
      sort = "new";
    } else if (rawView === "practical") {
      lens = "practical";
    } else if (rawView === "diary") {
      lens = "diary";
    }
  }

  return { sort, lens };
};

const PostsPage = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const rawCategory = typeof searchParams.category === "string" ? searchParams.category : "all";
  const rawTopic =
    typeof searchParams.topic === "string" ? (searchParams.topic as TravelTopic) : "all";
  const { category, topic } = normalizeFilters(rawCategory, rawTopic);
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const searchQuery = typeof searchParams.search === "string" ? searchParams.search : "";
  const { sort, lens } = resolveSortAndLens(
    typeof searchParams.sort === "string" ? searchParams.sort : undefined,
    typeof searchParams.lens === "string" ? searchParams.lens : undefined,
    typeof searchParams.view === "string" ? searchParams.view : undefined,
  );
  const region = typeof searchParams.region === "string" ? searchParams.region : "all";
  const tags =
    typeof searchParams.tags === "string"
      ? searchParams.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  const allPosts = await getAllPosts();

  let filteredPosts = allPosts;

  if (category !== "all") {
    filteredPosts = filteredPosts.filter((post) => post.category === category);
  }

  if (topic !== "all") {
    filteredPosts = filteredPosts.filter((post) => post.travelTopics?.includes(topic));
  }

  if (region !== "all") {
    // 指定リージョンの子孫（都市など）も含めて展開してフィルタリングする
    const regionSlugs = getRegionAndDescendantSlugs(region);
    filteredPosts = filteredPosts.filter((post) =>
      post.regionIds?.some((id) => regionSlugs.includes(id)),
    );
  }

  if (lens !== "all") {
    filteredPosts = filterByLens(filteredPosts, lens);
  }

  for (const tag of tags) {
    filteredPosts = filterByTag(filteredPosts, tag);
  }

  let processedPosts = filteredPosts;

  if (searchQuery) {
    processedPosts = filterPostsBySearch(filteredPosts, searchQuery);
    const scoredPosts = calculateScores(processedPosts, searchQuery);
    processedPosts = scoredPosts.sort((a, b) => b.score - a.score).map((item) => item.post);
  } else {
    processedPosts = getSortedPosts(processedPosts, sort);
  }

  const totalPosts = processedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const paginatedPosts = processedPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE,
  );

  const displayTotalPosts = totalPosts;

  // 維持基準を満たす厳選タグのうち、実際に記事に存在するものだけを候補にする
  const availableTags = FILTERABLE_TAGS.filter((tag) =>
    allPosts.some((post) => post.tags?.includes(tag)),
  );

  // 重い取得（getAllPosts）は return 前に解決済みで、BlogClient はサスペンドしない。
  // 以前ここにあった <Suspense> の fallback は表示されないデッドコードだったため撤去。
  // ページ遷移中のローディングは (pages)/loading.tsx が担当する。
  return (
    <BlogClient
      posts={paginatedPosts}
      totalPages={totalPages}
      currentPage={safePage}
      totalPosts={displayTotalPosts}
      activeSort={sort}
      activeLens={lens}
      availableTags={availableTags}
    />
  );
};

export default PostsPage;
