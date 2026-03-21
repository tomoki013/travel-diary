import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Post, TravelTopic } from "@/types/types";
import PostCard from "@/components/common/PostCard";
import { travelTopicOptions, getTravelTopicTitle } from "@/data/categories";

type PostMetadata = Omit<Post, "content">;

const HighIntentSection = ({ posts }: { posts: PostMetadata[] }) => {
  const grouped = travelTopicOptions
    .filter((topic) => topic.slug !== "all")
    .map((topic) => {
      const topicSlug = topic.slug as TravelTopic;
      return {
        topic: topicSlug,
        label: getTravelTopicTitle(topicSlug) || topic.title,
        posts: posts.filter((post) => post.travelTopics?.includes(topicSlug)).slice(0, 2),
      };
    })
    .filter((group) => group.posts.length > 0);

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h2 className="text-center text-3xl font-bold">旅の準備に役立つ実用ガイド</h2>
      <p className="mt-2 text-center text-muted-foreground">
        観光情報の中でも、準備や現地移動に直結する記事だけを厳選しています。
      </p>

      <div className="mt-8 grid gap-8">
        {grouped.map((group) => (
          <div
            key={group.topic}
            className="rounded-3xl border border-border/70 p-4 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold">{group.label}</h3>
              <Link
                href={`/posts?topic=${group.topic}`}
                className="group inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 transition hover:bg-teal-600 hover:text-white dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300"
              >
                もっと見る
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
