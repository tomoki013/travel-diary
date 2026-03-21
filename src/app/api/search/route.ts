import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/post-metadata";
import { filterPostsBySearch, calculateScores } from "@/lib/search";
import { SEARCH_CONFIG } from "@/constants/searchConfig";
import { TravelTopic } from "@/types/types";

export const revalidate = 3600; // 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const topic = searchParams.get("topic") as TravelTopic | null;

  if (!query && !category && !topic) {
    return NextResponse.json(
      { error: "Query or filter parameter is missing" },
      { status: 400 },
    );
  }

  try {
    const allPosts = await getAllPosts();
    let postsToSearch = allPosts;

    if (category) {
      postsToSearch = postsToSearch.filter((post) => post.category === category);
    }

    if (topic) {
      postsToSearch = postsToSearch.filter((post) =>
        post.travelTopics?.includes(topic)
      );
    }

    let finalPosts = postsToSearch;

    if (query) {
      const filteredBySearch = filterPostsBySearch(postsToSearch, query);
      const scoredPosts = calculateScores(filteredBySearch, query);
      finalPosts = scoredPosts
        .sort((a, b) => b.score - a.score)
        .map((item) => item.post);
    }

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
