import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import { Post, TravelTopic } from "@/types/types";
import PostCard from "@/components/common/PostCard";
import { travelTopicTitleMap } from "@/data/categories";
import { HIGH_INTENT_CATEGORIES } from "@/lib/revenue";

type PostMetadata = Omit<Post, "content">;

const HighIntentSection = ({ posts }: { posts: PostMetadata[] }) => {
  const tourismPosts = posts.filter(
    (post) => post.category === "tourism" && (post.travelTopics?.length || 0) > 0,
  );

  const grouped = HIGH_INTENT_CATEGORIES.map((topic) => ({
    category: topic,
    label: travelTopicTitleMap[topic as TravelTopic],
    posts: tourismPosts.filter((post) => post.travelTopics?.includes(topic as TravelTopic)).slice(0, 2),
  })).filter((group) => group.posts.length > 0);

  if (grouped.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50 px-4 py-1 text-xs font-bold text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300">
          <Compass className="h-3.5 w-3.5" />
          観光情報をまず見つけやすく
        </div>
        <h2 className="mt-4 text-3xl font-bold">旅行前に役立つ観光情報</h2>
        <p className="mt-3 text-muted-foreground">
          実用ラベルは、記事の中でしっかり情報を扱っている観光情報だけに絞って表示しています。
          出発前に確認したいテーマから、そのまま必要な記事へ進めます。
        </p>
      </div>

      <div className="mt-8 grid gap-8">
        {grouped.map((group) => (
          <div
            key={group.category}
            className="rounded-3xl border border-border/70 bg-card/70 p-4 shadow-sm sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Practical Topic
                </p>
                <h3 className="text-xl font-semibold">{group.label}</h3>
              </div>
              <Link
                href={`/posts?category=tourism&topic=${group.category}`}
                className="group inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 transition hover:bg-teal-600 hover:text-white dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300"
              >
                このテーマを見る
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {group.posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighIntentSection;
