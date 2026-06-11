import { getPostBySlug, getPostData } from "@/lib/posts";
import { getAllPosts } from "@/lib/post-metadata";
import Client from "./Client";
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
    const canonicalUrl = `/posts/${post.slug}`;
    const imageUrl = post.heroImage
      ? new URL(post.heroImage, PRIMARY_SITE_URL).toString()
      : undefined;

    return {
      title: post.title,
      description: post.description || post.excerpt,
      alternates: {
        canonical: canonicalUrl,
      },
      ...(post.noindex && {
        robots: {
          index: false,
          follow: true,
        },
      }),
      authors: post.author ? [{ name: post.author }] : [],
      openGraph: {
        title: post.title,
        description: post.description || post.excerpt,
        url: canonicalUrl,
        type: "article",
        publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
        modifiedTime: post.updatedAt
          ? new Date(post.updatedAt).toISOString()
          : post.publishedAt
            ? new Date(post.publishedAt).toISOString()
            : undefined,
        authors: post.author ? [post.author] : undefined,
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 675,
                alt: post.title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: imageUrl ? [imageUrl] : [],
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

  let postData: Awaited<ReturnType<typeof getPostData>>;
  try {
    postData = await getPostData(slug);
  } catch (e) {
    // エラーの内容をサーバーコンソールに出力する
    console.error("Failed to get post data:", e);
    return notFound();
  }

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
  } = postData;

  const absolutePostUrl = `${PRIMARY_SITE_URL}/posts/${post.slug}`;
  const absoluteImageUrl = post.heroImage
    ? new URL(post.heroImage, PRIMARY_SITE_URL).toString()
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absolutePostUrl}#blogposting`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absolutePostUrl,
    },
    headline: post.title,
    image: absoluteImageUrl ? [absoluteImageUrl] : undefined,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
    author: [
      {
        "@type": "Person",
        name: post.author || "ともきち",
        url: PRIMARY_SITE_URL,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "ともきちの旅行日記",
      url: PRIMARY_SITE_URL,
    },
    description: post.description || post.excerpt,
    url: absolutePostUrl,
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
        item: absolutePostUrl,
      },
    ],
  };

  const { content, headings, ...postForClient } = post;

  return (
    <>
      {/* "<" を Unicode エスケープし、本文由来の文字列で </script> が
          構成されてスクリプトを閉じられる(XSS)のを防ぐ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Client
        post={postForClient}
        headings={headings}
        previousPost={previousPost}
        nextPost={nextPost}
        regionRelatedPosts={regionRelatedPosts}
        previousCategoryPost={previousCategoryPost}
        nextCategoryPost={nextCategoryPost}
        previousSeriesPost={previousSeriesPost}
        nextSeriesPost={nextSeriesPost}
      >
        <ArticleContent content={content} currentPostCategory={post.category} allPosts={allPosts} />
      </Client>
    </>
  );
};

export default PostPage;
