import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/post-metadata";
import { filterPostsBySearch, calculateScores } from "@/lib/search";
import { SEARCH_CONFIG } from "@/constants/searchConfig";
import { TravelTopic } from "@/types/types";
import { filterByLens } from "@/lib/post-discovery";
import { filterByTag } from "@/lib/post-filters";
import { isLensKey } from "@/data/searchFilters";

export const revalidate = 3600; // 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const topic = searchParams.get("topic") as TravelTopic | null;
  const rawLens = searchParams.get("lens");
  const lens = rawLens && isLensKey(rawLens) ? rawLens : "all";
  const tags = (searchParams.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const hasFilter = Boolean(category || topic || lens !== "all" || tags.length > 0);

  if (!query && !hasFilter) {
    return NextResponse.json({ error: "Query or filter parameter is missing" }, { status: 400 });
  }

  if (query && query.length > 100) {
    return NextResponse.json({ error: "Query is too long" }, { status: 400 });
  }

  try {
    const allPosts = await getAllPosts();
    let postsToSearch = allPosts;

    if (category) {
      postsToSearch = postsToSearch.filter((post) => post.category === category);
    }

    if (topic) {
      postsToSearch = postsToSearch.filter((post) => post.travelTopics?.includes(topic));
    }

    if (lens !== "all") {
      postsToSearch = filterByLens(postsToSearch, lens);
    }

    for (const tag of tags) {
      postsToSearch = filterByTag(postsToSearch, tag);
    }

    let finalPosts = postsToSearch;

    if (query) {
      const filteredBySearch = filterPostsBySearch(postsToSearch, query);
      const scoredPosts = calculateScores(filteredBySearch, query);
      finalPosts = scoredPosts.sort((a, b) => b.score - a.score).map((item) => item.post);
    }

    const total = finalPosts.length;
    const suggestions = finalPosts.slice(0, SEARCH_CONFIG.API_MAX_RESULTS).map((post) => ({
      title: post.title,
      slug: post.slug,
    }));

    return NextResponse.json({
      suggestions,
      total,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
