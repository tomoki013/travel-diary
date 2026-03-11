import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/post-metadata";
import { filterPostsBySearch, calculateScores } from "@/lib/search";
import { SEARCH_CONFIG } from "@/constants/searchConfig";

export const revalidate = 3600; // 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");

  if (!query && !category) {
    return NextResponse.json(
      { error: "Query or category parameter is missing" },
      { status: 400 },
    );
  }

  try {
    const allPosts = await getAllPosts();
    let postsToSearch = allPosts;

    // 1. カテゴリで絞り込み（カテゴリが指定されている場合）
    if (category) {
      postsToSearch = postsToSearch.filter(
        (post) => post.category === category,
      );
    }

    let finalPosts = postsToSearch;

    // 2. 検索クエリでさらにフィルタリング & スコアリング（クエリがある場合）
    if (query) {
      const filteredBySearch = filterPostsBySearch(postsToSearch, query);
      const scoredPosts = calculateScores(filteredBySearch, query);
      finalPosts = scoredPosts
        .sort((a, b) => b.score - a.score)
        .map((item) => item.post);
    }

    // 3. 結果を整形して返却
    const total = finalPosts.length;
    const suggestions = finalPosts
      .slice(0, SEARCH_CONFIG.API_MAX_RESULTS)
      .map((post) => ({
        title: post.title,
        slug: post.slug,
      }));

    return NextResponse.json({
      suggestions,
      total,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
