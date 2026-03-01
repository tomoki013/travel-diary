import { getAllPosts, getPostBySlug, getPostData } from "@/lib/posts";
import Client from "./Client";
import InstallPWAButton from "@/components/features/pwa/InstallPWAButton";
import ArticleContent from "@/components/features/article/Article";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

// 1. 静的パスを生成
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 2. 動的にメタデータを生成
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  try {
    const post = await getPostBySlug(params.slug);

    return {
      title: post.title,
      description: post.excerpt,
      authors: post.author ? [{ name: post.author }] : [],
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        images: post.image
          ? [
              {
                url: post.image,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ]
          : [],
      },
      twitter: {
        title: post.title,
        description: post.excerpt,
        images: post.image ? [post.image] : [],
      },
    };
  } catch {
    return {
      title: "記事が見つかりませんでした",
      description: "指定された記事は存在しません。",
    };
  }
}

// 3. Pageコンポーネント
const PostPage = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const slug = params.slug;

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
      nextActionPosts,
    } = await getPostData(slug);

    return (
      <Client
        post={post}
        previousPost={previousPost}
        nextPost={nextPost}
        regionRelatedPosts={regionRelatedPosts}
        previousCategoryPost={previousCategoryPost}
        nextCategoryPost={nextCategoryPost}
        previousSeriesPost={previousSeriesPost}
        nextSeriesPost={nextSeriesPost}
        nextActionPosts={nextActionPosts}
      >
        <ArticleContent
          content={post.content}
          currentPostCategory={post.category}
          allPosts={allPosts}
        />
        <div className="flex justify-center py-10">
          <InstallPWAButton />
        </div>
      </Client>
    );
  } catch (e) {
    // エラーの内容をサーバーコンソールに出力する
    console.error("Failed to get post data:", e);
    return notFound();
  }
};

export default PostPage;
