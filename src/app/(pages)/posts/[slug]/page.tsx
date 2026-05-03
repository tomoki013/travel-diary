import { getPostBySlug, getPostData } from "@/lib/posts";
import { getAllPosts } from "@/lib/post-metadata";
import Client from "./Client";
import InstallPWAButton from "@/components/features/pwa/InstallPWAButton";
import ArticleContent from "@/components/features/article/Article";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRIMARY_SITE_URL } from "@/constants/site";

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
      alternates: {
        canonical: `/posts/${post.slug}`,
      },
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
    } = await getPostData(slug);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      image: post.image ? [post.image] : [],
      datePublished: post.dates?.[0] ? new Date(post.dates[0]).toISOString() : undefined,
      dateModified: post.dates?.[post.dates.length - 1] ? new Date(post.dates[post.dates.length - 1]).toISOString() : undefined,
      author: [
        {
          "@type": "Person",
          name: post.author || "ともきち",
          url: PRIMARY_SITE_URL,
        },
      ],
      description: post.excerpt,
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: PRIMARY_SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Posts",
          item: `${PRIMARY_SITE_URL}/posts`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `${PRIMARY_SITE_URL}/posts/${post.slug}`,
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
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
          <div className="flex justify-center py-10">
            <InstallPWAButton />
          </div>
        </Client>
      </>
    );
  } catch (e) {
    // エラーの内容をサーバーコンソールに出力する
    console.error("Failed to get post data:", e);
    return notFound();
  }
};

export default PostPage;
