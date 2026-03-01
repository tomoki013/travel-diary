"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { CtaItem } from "@/constants/revenue";
import { Post } from "@/types/types";

type PostMetadata = Omit<Post, "content">;

export const OfferCard = ({ item }: { item: CtaItem }) => (
  <article className="rounded-2xl border border-teal-200/60 bg-teal-50/50 p-5 dark:border-teal-800 dark:bg-teal-950/30">
    <p className="text-xs font-semibold text-teal-700">{item.serviceName}</p>
    <h3 className="mt-1 text-lg font-bold">{item.title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
    <ul className="mt-3 space-y-1 text-sm">
      {item.comparePoints.map((point) => (
        <li key={point}>• {point}</li>
      ))}
    </ul>
    <Link
      href={item.href}
      className="mt-4 inline-flex rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
      onClick={() => trackEvent(item.eventName, { destination: item.href })}
    >
      {item.buttonText}
    </Link>
  </article>
);

export const ReviewCardGroup = ({ items }: { items: CtaItem[] }) => (
  <div className="grid gap-4 md:grid-cols-2">{items.map((item) => <OfferCard key={item.title} item={item} />)}</div>
);

export const ComparisonTable = ({ items }: { items: CtaItem[] }) => (
  <div className="overflow-x-auto rounded-xl border">
    <table className="w-full text-sm">
      <thead className="bg-muted/50 text-left">
        <tr><th className="p-3">サービス</th><th className="p-3">比較ポイント</th><th className="p-3">導線</th></tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.title} className="border-t">
            <td className="p-3 font-semibold">{item.serviceName}</td>
            <td className="p-3">{item.comparePoints.join(" / ")}</td>
            <td className="p-3"><Link href={item.href} onClick={() => trackEvent(item.eventName)} className="text-teal-700 underline">{item.buttonText}</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const NextStepLinks = ({ posts }: { posts: PostMetadata[] }) => {
  if (!posts.length) return null;
  return (
    <section className="rounded-2xl border border-dashed p-5">
      <h3 className="text-lg font-bold">次の準備はこちら</h3>
      <ul className="mt-3 space-y-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`} className="text-teal-700 underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
