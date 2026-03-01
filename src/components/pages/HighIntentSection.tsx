import Link from "next/link";
import { Post } from "@/types/types";
import PostCard from "@/components/common/PostCard";
import { CATEGORY_LABELS } from "@/constants/revenue";
import { HIGH_INTENT_CATEGORIES } from "@/lib/revenue";

type PostMetadata = Omit<Post, "content">;

const HighIntentSection = ({ posts }: { posts: PostMetadata[] }) => {
  const grouped = HIGH_INTENT_CATEGORIES.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    posts: posts.filter((p) => p.revenueCategory === category).slice(0, 2),
  })).filter((g) => g.posts.length > 0);

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h2 className="text-center text-3xl font-bold">旅行前に役立つカテゴリ</h2>
      <p className="mt-2 text-center text-muted-foreground">まずは準備に直結する高意図記事からどうぞ。</p>
      <div className="mt-8 grid gap-8">
        {grouped.map((group) => (
          <div key={group.category}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold">{group.label}</h3>
              <Link href={`/posts?search=${encodeURIComponent(group.label)}`} className="text-sm text-teal-700 underline">もっと見る</Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {group.posts.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighIntentSection;
