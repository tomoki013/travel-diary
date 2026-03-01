import { getAllPosts } from "@/lib/posts";
import BlogClient from "./Client";
import { Suspense } from "react";
import { Metadata } from "next";
import { LoadingAnimation } from "@/components/features/LoadingAnimation/LoadingAnimation";
import { POSTS_PER_PAGE } from "@/constants/constants";
import { filterPostsBySearch, calculateScores } from "@/lib/search";

export const metadata: Metadata = {
  title: "全記事一覧 - Blog ",
  description:
    "「ともきちの旅行日記」の全記事を時系列で掲載しています。世界中の旅の記録や旅行記、観光情報をお届け。あなたの次の冒険のヒントがきっと見つかります。",
};

const PostsPage = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const category =
    typeof searchParams.category === "string" ? searchParams.category : "all";
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
    processedPosts = processedPosts.filter(
      (post) => post.category === category || post.revenueCategory === category
    );
  }

  const totalPosts = processedPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const paginatedPosts = processedPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE,
  );

  // 検索またはカテゴリ絞り込みがある場合のみ、総件数を渡す
  const displayTotalPosts = searchQuery || category !== "all" ? totalPosts : null;

  return (
    <Suspense fallback={<LoadingAnimation variant="mapRoute" />}>
      <BlogClient
        posts={paginatedPosts}
        totalPages={totalPages}
        currentPage={page}
        totalPosts={displayTotalPosts}
      />
    </Suspense>
  );
};

export default PostsPage;
