import { getAllPosts } from "@/lib/post-metadata";
import BlogClient from "./Client";
import { Suspense } from "react";
import { Metadata } from "next";
import { LoadingAnimation } from "@/components/features/LoadingAnimation/LoadingAnimation";
import { POSTS_PER_PAGE } from "@/constants/constants";
import { filterPostsBySearch, calculateScores } from "@/lib/search";
import { TravelTopic } from "@/types/types";

export const metadata: Metadata = {
  title: "全記事一覧 - Blog ",
  description:
    "「ともきちの旅行日記」の全記事を時系列で掲載しています。世界中の旅の記録や旅行記、観光情報をお届け。あなたの次の冒険のヒントがきっと見つかります。",
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

  const allPosts = await getAllPosts();

  let processedPosts = allPosts;

  if (searchQuery) {
    processedPosts = filterPostsBySearch(processedPosts, searchQuery);
    const scoredPosts = calculateScores(processedPosts, searchQuery);
    processedPosts = scoredPosts
      .sort((a, b) => b.score - a.score)
      .map((item) => item.post);
  }

  if (category !== "all") {
    processedPosts = processedPosts.filter((post) => post.category === category);
  }

  if (topic !== "all") {
    processedPosts = processedPosts.filter((post) =>
      post.travelTopics?.includes(topic)
    );
  }

  const totalPosts = processedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const paginatedPosts = processedPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE,
  );

  const displayTotalPosts =
    searchQuery || category !== "all" || topic !== "all" ? totalPosts : null;

  return (
    <Suspense fallback={<LoadingAnimation variant="mapRoute" />}>
      <BlogClient
        posts={paginatedPosts}
        totalPages={totalPages}
        currentPage={safePage}
        totalPosts={displayTotalPosts}
      />
    </Suspense>
  );
};

export default PostsPage;
