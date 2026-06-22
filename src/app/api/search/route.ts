import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/post-metadata";
import { SEARCH_CONFIG } from "@/constants/searchConfig";
import { isLensKey } from "@/data/searchFilters";
import { searchPosts, SEARCH_QUERY_MAX_LENGTH } from "@/lib/searchService";

export const revalidate = 3600; // 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category") || "all";
  const topic = searchParams.get("topic") || "all";
  const rawLens = searchParams.get("lens");
  const lens = rawLens && isLensKey(rawLens) ? rawLens : "all";
  const region = searchParams.get("region") || "all";
  const tags = (searchParams.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const hasFilter =
    category !== "all" || topic !== "all" || lens !== "all" || region !== "all" || tags.length > 0;

  if (!query && !hasFilter) {
    return NextResponse.json({ error: "Query or filter parameter is missing" }, { status: 400 });
  }

  if (query && query.length > SEARCH_QUERY_MAX_LENGTH) {
    return NextResponse.json({ error: "Query is too long" }, { status: 400 });
  }

  try {
    const allPosts = await getAllPosts();
    // /posts と同じ条件・適用順で検索する共通サービスに委譲する
    const { posts, total } = searchPosts(allPosts, {
      query: query || "",
      category,
      topic,
      lens,
      tags,
      region,
    });

    const suggestions = posts.slice(0, SEARCH_CONFIG.API_MAX_RESULTS).map((post) => ({
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
