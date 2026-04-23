import { Post } from "@/types/types";
import Image from "next/image";
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

      <div className="grid gap-4">
        {nextActionPosts.slice(0, 3).map((post, index) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group flex flex-col gap-4 rounded-2xl border border-teal-200/70 bg-background/90 p-4 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-sm dark:border-teal-900 sm:flex-row"
          >
            <div className="relative aspect-[16/10] shrink-0 overflow-hidden rounded-xl bg-teal-100 ring-1 ring-teal-200/60 dark:bg-teal-950/50 dark:ring-teal-900 sm:w-56 md:w-64">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-teal-100 via-cyan-50 to-background dark:from-teal-950 dark:via-cyan-950/50 dark:to-background" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/20 via-transparent to-transparent" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                Step {index + 1}
              </p>
              <h3 className="mt-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-teal-700 dark:group-hover:text-teal-300">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt || "次に読む価値がある記事です。"}
              </p>
              <p className="mt-4 text-xs font-medium text-teal-700 dark:text-teal-300">
                {getReasonText(currentPost, post)}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-teal-700 dark:text-teal-300">
                この記事を読む
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ArticleCTASection;
