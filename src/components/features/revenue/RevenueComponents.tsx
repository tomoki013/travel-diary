"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink, MapPin } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { CtaItem } from "@/constants/revenue";
import { Post } from "@/types/types";

type PostMetadata = Omit<Post, "content">;

export const OfferCard = ({ item }: { item: CtaItem }) => (
  <article className="group rounded-2xl border border-teal-200/70 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-teal-900 dark:bg-slate-950/70">
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase dark:text-teal-300">
        {item.serviceName}
      </p>
      <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-900/60 dark:text-teal-300">
        推奨
      </span>
    </div>

    <h3 className="mt-2 text-lg font-bold leading-snug">{item.title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>

    <ul className="mt-4 space-y-1.5 text-sm">
      {item.comparePoints.map((point) => (
        <li key={point} className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-teal-600" />
          <span>{point}</span>
        </li>
      ))}
    </ul>

    <p className="mt-4 inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
      <MapPin className="h-3.5 w-3.5" />
      遷移先: {item.destinationLabel}
    </p>

    <Link
      href={item.href}
      className="mt-5 inline-flex items-center gap-1 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
      onClick={() =>
        trackEvent(item.eventName, {
          destination: item.href,
          destinationLabel: item.destinationLabel,
          ui: "offer_card",
        })
      }
    >
      {item.buttonText}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
    </Link>
  </article>
);

export const ReviewCardGroup = ({ items }: { items: CtaItem[] }) => (
  <div className="grid gap-4 md:grid-cols-2">
    {items.map((item) => (
      <OfferCard key={item.title} item={item} />
    ))}
  </div>
);

export const ComparisonTable = ({ items }: { items: CtaItem[] }) => (
  <div className="grid gap-3 md:grid-cols-2">
    {items.map((item) => (
      <article key={item.title} className="rounded-2xl border bg-card p-4">
        <p className="text-xs font-semibold text-teal-700">{item.serviceName}</p>
        <h4 className="mt-1 text-sm font-bold leading-snug">{item.title}</h4>

        <div className="mt-3 rounded-xl bg-muted/40 p-3">
          <p className="text-xs font-semibold text-muted-foreground">比較ポイント</p>
          <ul className="mt-2 space-y-1 text-sm">
            {item.comparePoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-teal-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          このリンクは <span className="font-semibold text-foreground">{item.destinationLabel}</span> へ移動します。
        </p>

        <Link
          href={item.href}
          onClick={() =>
            trackEvent(item.eventName, {
              destination: item.href,
              destinationLabel: item.destinationLabel,
              ui: "comparison_card",
            })
          }
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 underline underline-offset-2"
        >
          {item.buttonText}
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </article>
    ))}
  </div>
);

export const NextStepLinks = ({ posts }: { posts: PostMetadata[] }) => {
  if (!posts.length) return null;

  return (
    <section className="mt-10 rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50/80 via-background to-orange-50/70 p-6 dark:border-amber-900/70 dark:from-amber-950/30 dark:to-orange-950/20">
      <h3 className="text-lg font-bold">次の準備はこちら</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        読み終わったら、この順で進めると準備がスムーズです。
      </p>

      <ol className="mt-4 space-y-3">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-amber-200/70 bg-background px-4 py-3 transition hover:border-amber-300 hover:bg-amber-50/40 dark:border-amber-900"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-medium leading-relaxed">{post.title}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-amber-700 transition group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};
