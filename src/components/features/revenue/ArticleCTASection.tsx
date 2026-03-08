import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CtaItem } from "@/constants/revenue";
import { Post } from "@/types/types";
import { ComparisonTable, ReviewCardGroup } from "./RevenueComponents";

type PostMetadata = Omit<Post, "content">;

const buildPostCtaItems = (posts: PostMetadata[]): CtaItem[] =>
  posts.slice(0, 2).map((post, index) => ({
    title: post.title,
    description:
      post.excerpt || "次の準備に進む前に、要点だけ先にチェックしておきましょう。",
    serviceName: `STEP ${index + 1}`,
    comparePoints: [
      post.category === "itinerary" ? "旅程の流れ" : "準備の手順",
      post.location?.[0] ? `対象: ${post.location[0]}` : "同じ文脈の記事",
      "この記事の次に読む候補",
    ],
    buttonText: "この記事を読む",
    href: `/posts/${post.slug}`,
    destinationLabel: `${post.title} 記事`,
    eventName: "cta_next_article_click",
  }));

const ArticleCTASection = ({ nextActionPosts = [] }: { nextActionPosts?: PostMetadata[] }) => {
  const items = buildPostCtaItems(nextActionPosts);

  return (
    <section className="my-12 overflow-hidden rounded-3xl border border-teal-200/60 bg-gradient-to-br from-teal-50/80 via-background to-cyan-50/60 p-6 shadow-sm dark:border-teal-900/80 dark:from-teal-950/20 dark:via-background dark:to-cyan-950/20">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-bold text-white">
          NEXT ACTION
        </span>
        <h2 className="text-2xl font-bold">この記事の次にやること</h2>
      </div>

      {items.length > 0 ? (
        <>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            今読んだ内容と文脈がつながる記事だけを、次の行動順で表示しています。
          </p>
          <ReviewCardGroup items={items} />
          <div className="mt-6 rounded-2xl border border-dashed border-teal-300/80 bg-background/70 p-3 dark:border-teal-800">
            <p className="mb-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
              比較ポイント一覧
            </p>
            <ComparisonTable items={items} />
          </div>
        </>
      ) : (
        <>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            このテーマで自然につながる次記事が見つからなかったため、無理な記事誘導は表示していません。
          </p>
          <div className="rounded-2xl border border-dashed border-teal-300/80 bg-background/70 p-4 dark:border-teal-800">
            <p className="mb-2 text-xs font-semibold text-teal-700 dark:text-teal-300">次の準備チェック</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" />この記事の要点を保存する</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" />必要な手続きや予約期限をカレンダーに入れる</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" />準備全体を確認したい場合は記事一覧へ進む</li>
            </ul>
            <Link
              href="/posts"
              className="mt-4 inline-flex items-center gap-1 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              記事一覧を見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default ArticleCTASection;
