import { getAllPosts } from "@/lib/post-metadata";
import BlogClient from "./Client";
import { Suspense } from "react";
import { Metadata } from "next";
import { LoadingAnimation } from "@/components/features/LoadingAnimation/LoadingAnimation";
import { POSTS_PER_PAGE } from "@/constants/constants";
import { filterPostsBySearch, calculateScores } from "@/lib/search";
import { TravelTopic } from "@/types/types";
import { BlogDiscoveryView, getPostsForView, getRecommendedPosts } from "@/lib/post-discovery";

export const metadata: Metadata = {
  title: "全記事一覧 - Blog ",
  description:
    "「ともきちの旅行日記」の記事一覧です。新着だけでなく、初めて読む人向けのおすすめ、実用情報、旅行記から入口を選べます。",
};

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

const isDiscoveryView = (value: string): value is BlogDiscoveryView =>
  value === "recommended" ||
  value === "new" ||
  value === "practical" ||
  value === "diary";

const PostsPage = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const rawCategory =
    typeof searchParams.category === "string" ? searchParams.category : "all";
  const rawTopic =
    typeof searchParams.topic === "string" ? (searchParams.topic as TravelTopic) : "all";
  const { category, topic } = normalizeFilters(rawCategory, rawTopic);
  const page =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const searchQuery =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const rawView =
    typeof searchParams.view === "string" ? searchParams.view : "recommended";
  const view = isDiscoveryView(rawView) ? rawView : "recommended";
  const region =
    typeof searchParams.region === "string" ? searchParams.region : "all";

  const allPosts = await getAllPosts();

  let filteredPosts = allPosts;

  if (category !== "all") {
    filteredPosts = filteredPosts.filter((post) => post.category === category);
  }

  if (topic !== "all") {
    filteredPosts = filteredPosts.filter((post) =>
      post.travelTopics?.includes(topic)
    );
  }

  if (region !== "all") {
    filteredPosts = filteredPosts.filter((post) =>
      post.location?.includes(region)
    );
  }

  let processedPosts = filteredPosts;

  if (searchQuery) {
    processedPosts = filterPostsBySearch(filteredPosts, searchQuery);
    const scoredPosts = calculateScores(processedPosts, searchQuery);
    processedPosts = scoredPosts
      .sort((a, b) => b.score - a.score)
      .map((item) => item.post);
  } else {
    processedPosts = getPostsForView(processedPosts, view);
  }

  const leadPicks = searchQuery
    ? processedPosts.slice(0, 3)
    : getRecommendedPosts(processedPosts).slice(0, 3);

  const totalPosts = processedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const paginatedPosts = processedPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE,
  );

  const displayTotalPosts = totalPosts;

  return (
    <Suspense fallback={<LoadingAnimation variant="mapRoute" />}>
      <BlogClient
        leadPicks={leadPicks}
        posts={paginatedPosts}
        totalPages={totalPages}
        currentPage={safePage}
        totalPosts={displayTotalPosts}
        activeView={view}
      />
    </Suspense>
  );
};

export default PostsPage;
