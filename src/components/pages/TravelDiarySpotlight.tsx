import Link from "next/link";
import { Heart, NotebookPen } from "lucide-react";
import PostCard from "@/components/common/PostCard";
import { Post } from "@/types/types";

type PostMetadata = Omit<Post, "content">;

interface TravelDiarySpotlightProps {
  posts: PostMetadata[];
}

const TravelDiarySpotlight = ({ posts }: TravelDiarySpotlightProps) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="overflow-hidden rounded-[2rem] border border-rose-200/70 bg-gradient-to-br from-rose-50 via-white to-amber-50 shadow-sm dark:border-rose-900/60 dark:from-rose-950/20 dark:via-background dark:to-amber-950/10">
        <div className="grid gap-10 p-6 md:grid-cols-[1.05fr_1.45fr] md:p-10">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-1 text-xs font-bold text-rose-600 shadow-sm dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
              <Heart className="h-3.5 w-3.5" />
              Travel Diary
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              旅の体温まで伝わる、
              <br />
              ともきちの旅行日記
            </h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              このサイトでは、役立つ観光情報だけでなく、旅先で感じた空気や小さな発見、
              ちょっとしたハプニングも大事に残しています。
              準備に使える記事の隣で、旅そのものの温かさも楽しんでもらえたらうれしいです。
            </p>

            <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <NotebookPen className="h-4 w-4 text-rose-500" />
                読んでほしい日記の雰囲気
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
                <li>・観光地だけでなく、その日の気分や街の空気感も残しています。</li>
                <li>・旅程の流れが追えるので、次の旅のイメージ作りにも使えます。</li>
                <li>・「役立つ」と「好き」が同居するトップページを目指しました。</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/journey"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background transition hover:opacity-90"
              >
                旅の軌跡を見る
              </Link>
              <Link
                href="/series"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition hover:border-rose-300 hover:text-rose-500"
              >
                旅行記をもっと読む
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelDiarySpotlight;
