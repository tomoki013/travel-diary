import { Post } from "@/types/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getGeoRelationship } from "@/lib/post-discovery";
import { getTravelTopicTitle } from "@/data/categories";
import { getRegionBySlug } from "@/lib/regionUtil";

type PostMetadata = Omit<Post, "content">;

const getReasonText = (currentPost: PostMetadata, post: PostMetadata) => {
  const geo = getGeoRelationship(currentPost, post);
  const sharedTopic = (post.travelTopics || []).find((topic) =>
    currentPost.travelTopics?.includes(topic)
  );
  const primaryLocation = post.location?.[0];
  const locationName = primaryLocation
    ? getRegionBySlug(primaryLocation)?.name || primaryLocation
    : null;

  if (geo.sameSpecificLocation && locationName) {
    return `${locationName}の流れで続けて読めます`;
  }

  if (geo.sameCountry && locationName) {
    return `${locationName}周辺の文脈でつながる記事です`;
  }

  if (sharedTopic) {
    return `${getTravelTopicTitle(sharedTopic)}の準備を続けて進められます`;
  }

  if (currentPost.series && currentPost.series === post.series) {
    return "同じシリーズの流れで読めます";
  }

  if (currentPost.category === post.category) {
    return "同じタイプの記事として読み進めやすい内容です";
  }

  return "今の文脈から次に読みやすい記事です";
};

const ArticleCTASection = ({
  currentPost,
  nextActionPosts = [],
}: {
  currentPost: PostMetadata;
  nextActionPosts?: PostMetadata[];
}) => {
  if (nextActionPosts.length === 0) {
    return null;
  }

  return (
    <section className="my-12 overflow-hidden rounded-3xl border border-teal-200/60 bg-gradient-to-br from-teal-50/80 via-background to-cyan-50/60 p-6 shadow-sm dark:border-teal-900/80 dark:from-teal-950/20 dark:via-background dark:to-cyan-950/20">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-bold text-white">
          NEXT ACTION
        </span>
        <h2 className="text-2xl font-bold">この記事の次にやること</h2>
      </div>

      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        今読んだ内容と旅程や地域の文脈がつながる記事だけを、次の一歩として絞って出しています。
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {nextActionPosts.slice(0, 3).map((post, index) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group rounded-2xl border border-teal-200/70 bg-background/90 p-5 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-sm dark:border-teal-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
              Step {index + 1}
            </p>
            <h3 className="mt-2 text-lg font-bold leading-snug text-foreground">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {post.excerpt || "次に読む価値がある記事です。"}
            </p>
            <p className="mt-4 text-xs font-medium text-teal-700 dark:text-teal-300">
              {getReasonText(currentPost, post)}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-300">
              この記事を読む
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ArticleCTASection;
