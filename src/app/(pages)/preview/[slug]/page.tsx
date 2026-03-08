import { getDraftPostBySlug, getDraftPostData } from "@/lib/posts";
import Client from "../../posts/[slug]/Client";
import ArticleContent from "@/components/features/article/Article";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

// Prevent static generation for preview pages
export const dynamic = "force-dynamic";

// 動的にメタデータを生成
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  try {
    const post = await getDraftPostBySlug(params.slug);

    return {
      title: `[PREVIEW] ${post.title}`,
      description: post.excerpt,
      authors: post.author ? [{ name: post.author }] : [],
      robots: { index: false, follow: false }, // Don't index preview pages
    };
  } catch {
    return {
      title: "記事が見つかりませんでした",
      description: "指定された記事は存在しません。",
    };
  }
}

// Preview Pageコンポーネント
const DraftPreviewPage = async (props: { params: Promise<{ slug: string }> }) => {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("preview_auth")?.value === "true";
  const params = await props.params;
  const slug = params.slug;

  if (!isAuthenticated) {
    redirect(`/preview/login?callbackUrl=/preview/${slug}`);
  }

  try {
    const {
      post,
      previousPost,
      nextPost,
      regionRelatedPosts,
      allPosts,
      previousCategoryPost,
      nextCategoryPost,
      previousSeriesPost,
      nextSeriesPost,
    } = await getDraftPostData(slug);

    return (
      <div className="relative">
        <div className="sticky top-0 z-50 bg-yellow-500 text-black text-center py-1 font-bold">
          PREVIEW MODE - DRAFT POST
        </div>
        <Client
          post={post}
          previousPost={previousPost}
          nextPost={nextPost}
          regionRelatedPosts={regionRelatedPosts}
          previousCategoryPost={previousCategoryPost}
          nextCategoryPost={nextCategoryPost}
          previousSeriesPost={previousSeriesPost}
          nextSeriesPost={nextSeriesPost}
        >
          <ArticleContent
            content={post.content}
            currentPostCategory={post.category}
            allPosts={allPosts}
          />
        </Client>
      </div>
    );
  } catch (e) {
    console.error("Failed to get draft post data:", e);
    return notFound();
  }
};

export default DraftPreviewPage;
