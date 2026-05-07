"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { PrimitiveNode, GeneratedTopPage } from "./schema";
import { AirportAnxietyMap } from "@/components/generative-ui/AirportAnxietyMap";
import { BudgetSimulator } from "@/components/generative-ui/BudgetSimulator";
import { DestinationComparisonBoard } from "@/components/generative-ui/DestinationComparisonBoard";
import { ItineraryDisplay } from "@/components/generative-ui/ItineraryDisplay";
import { PackingList } from "@/components/generative-ui/PackingList";
import { PhotoOppsComparison } from "@/components/generative-ui/PhotoOppsComparison";
import { ArticleEmbedder } from "@/components/generative-ui/ArticleEmbedder";

// ─────────────────────────────────────────────
// Article index lookup (resolved client-side from page props)
// ─────────────────────────────────────────────
export type ArticleIndex = Record<
  string,
  { slug: string; title: string; summaryForAI: string; heroImageId?: string }
>;

type RendererContext = {
  articleIndex: ArticleIndex;
};

// ─────────────────────────────────────────────
// Root renderer
// ─────────────────────────────────────────────
export function PrimitiveRenderer({
  schema,
  articleIndex,
}: {
  schema: GeneratedTopPage;
  articleIndex: ArticleIndex;
}) {
  const ctx: RendererContext = { articleIndex };
  return (
    <div className="space-y-6">
      {schema.sections.map((node) => (
        <NodeRenderer key={node.id} node={node} ctx={ctx} depth={0} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Recursive node renderer
// ─────────────────────────────────────────────
function NodeRenderer({
  node,
  ctx,
  depth,
}: {
  node: PrimitiveNode;
  ctx: RendererContext;
  depth: number;
}) {
  if (depth > 8) return null;
  switch (node.type) {
    case "section":
      return <SectionPrimitive node={node} ctx={ctx} depth={depth} />;
    case "container":
      return <ContainerPrimitive node={node} ctx={ctx} depth={depth} />;
    case "stack":
      return <StackPrimitive node={node} ctx={ctx} depth={depth} />;
    case "grid":
      return <GridPrimitive node={node} ctx={ctx} depth={depth} />;
    case "heading":
      return <HeadingPrimitive node={node} />;
    case "text":
      return <TextPrimitive node={node} />;
    case "badge":
      return <BadgePrimitive node={node} />;
    case "button":
      return <ButtonPrimitive node={node} ctx={ctx} />;
    case "choice_grid":
      return <ChoiceGridPrimitive node={node} />;
    case "article_card":
      return <ArticleCardPrimitive node={node} ctx={ctx} />;
    case "article_list":
      return <ArticleListPrimitive node={node} ctx={ctx} />;
    case "image":
      return <ImagePrimitive node={node} ctx={ctx} />;
    case "image_gallery":
      return <ImageGalleryPrimitive node={node} ctx={ctx} />;
    case "comparison_table":
      return <ComparisonTablePrimitive node={node} />;
    case "score_card":
      return <ScoreCardPrimitive node={node} />;
    case "callout":
      return <CalloutPrimitive node={node} />;
    case "tabs":
      return <TabsPrimitive node={node} ctx={ctx} depth={depth} />;
    case "accordion":
      return <AccordionPrimitive node={node} ctx={ctx} depth={depth} />;
    case "timeline":
      return <TimelinePrimitive node={node} ctx={ctx} />;
    case "next_action":
      return <NextActionPrimitive node={node} ctx={ctx} />;
    // Rich interactive components
    case "airport_anxiety_map":
      return <AirportAnxietyMapPrimitive node={node} />;
    case "budget_simulator":
      return <BudgetSimulatorPrimitive node={node} />;
    case "destination_comparison":
      return <DestinationComparisonPrimitive node={node} />;
    case "itinerary_display":
      return <ItineraryDisplayPrimitive node={node} />;
    case "packing_list":
      return <PackingListPrimitive node={node} />;
    case "photo_spots":
      return <PhotoSpotsPrimitive node={node} />;
    case "article_embedder":
      return <ArticleEmbedderPrimitive node={node} ctx={ctx} />;
    default:
      return null;
  }
}

function Children({ node, ctx, depth }: { node: PrimitiveNode; ctx: RendererContext; depth: number }) {
  if (!node.children?.length) return null;
  return (
    <>
      {node.children.map((child) => (
        <NodeRenderer key={child.id} node={child} ctx={ctx} depth={depth + 1} />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────

function SectionPrimitive({ node, ctx, depth }: { node: PrimitiveNode; ctx: RendererContext; depth: number }) {
  return (
    <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5 space-y-4">
      <Children node={node} ctx={ctx} depth={depth} />
    </section>
  );
}

function ContainerPrimitive({ node, ctx, depth }: { node: PrimitiveNode; ctx: RendererContext; depth: number }) {
  return (
    <div className="space-y-3">
      <Children node={node} ctx={ctx} depth={depth} />
    </div>
  );
}

function StackPrimitive({ node, ctx, depth }: { node: PrimitiveNode; ctx: RendererContext; depth: number }) {
  return (
    <div className="flex flex-col gap-2">
      <Children node={node} ctx={ctx} depth={depth} />
    </div>
  );
}

function GridPrimitive({ node, ctx, depth }: { node: PrimitiveNode; ctx: RendererContext; depth: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Children node={node} ctx={ctx} depth={depth} />
    </div>
  );
}

function HeadingPrimitive({ node }: { node: PrimitiveNode }) {
  const text = safeString(node.props.text);
  const level = safeNumber(node.props.level, 2, 2, 4);
  if (!text) return null;
  const cls = "font-bold text-zinc-900 dark:text-zinc-100";
  if (level === 2) return <h2 className={`text-xl ${cls}`}>{text}</h2>;
  if (level === 3) return <h3 className={`text-lg ${cls}`}>{text}</h3>;
  return <h4 className={`text-base ${cls}`}>{text}</h4>;
}

function TextPrimitive({ node }: { node: PrimitiveNode }) {
  const text = safeString(node.props.text);
  if (!text) return null;
  return <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{text}</p>;
}

function BadgePrimitive({ node }: { node: PrimitiveNode }) {
  const label = safeString(node.props.label);
  if (!label) return null;
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
      {label}
    </span>
  );
}

function ButtonPrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const label = safeString(node.props.label ?? node.props.text);
  const articleId = safeString(node.props.articleId);
  if (!label) return null;
  if (articleId && ctx.articleIndex[articleId]) {
    const article = ctx.articleIndex[articleId];
    return (
      <Link
        href={`/posts/${article.slug}`}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:opacity-80 transition"
      >
        {label}
      </Link>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {label}
    </span>
  );
}

function ChoiceGridPrimitive({ node }: { node: PrimitiveNode }) {
  const choices = safeArray<{ label: string; value: string }>(node.props.choices);
  const [selected, setSelected] = React.useState<string | null>(null);
  if (!choices.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {choices.map((c) => {
        const label = safeString(c.label);
        const value = safeString(c.value);
        if (!label) return null;
        const isSelected = selected === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setSelected(isSelected ? null : value)}
            className={`px-3 py-1.5 rounded-xl border text-sm transition ${
              isSelected
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                : "border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ArticleCardPrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const articleId = safeString(node.props.articleId);
  if (!articleId) return null;
  const article = ctx.articleIndex[articleId];
  if (!article) return null;
  return (
    <Link
      href={`/posts/${article.slug}`}
      className="block rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:shadow-md transition group"
    >
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 line-clamp-2">
        {article.title}
      </p>
      {article.summaryForAI && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500 line-clamp-2">
          {article.summaryForAI}
        </p>
      )}
    </Link>
  );
}

function ArticleListPrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const ids = safeArray<string>(node.props.articleIds).slice(0, 10);
  const articles = ids
    .map((id) => ({ id, article: ctx.articleIndex[id] }))
    .filter((x) => x.article);
  if (!articles.length) return null;
  return (
    <ul className="space-y-2">
      {articles.map(({ id, article }) => (
        <li key={id}>
          <Link
            href={`/posts/${article.slug}`}
            className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
          >
            <span className="mt-0.5 text-zinc-400">›</span>
            <span className="line-clamp-2">{article.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// image: AIがarticleIdを指定 → articleIndexからheroImageIdを解決して表示
// AIがsrcを直接指定することはできない（propsのsrc/urlはrenderer側で無視）
function ImagePrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const articleId = safeString(node.props.articleId);
  const alt = safeString(node.props.alt ?? node.props.caption ?? "");

  // articleId経由で解決する（AIがsrc/urlを直指定しても無視）
  if (articleId) {
    const article = ctx.articleIndex[articleId];
    const src = article?.heroImageId;
    if (src && isTrustedImagePath(src)) {
      return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={src}
            alt={alt || article.title}
            fill
            sizes="(max-width: 640px) 100vw, 672px"
            className="object-cover"
          />
          {alt && (
            <p className="absolute bottom-0 left-0 right-0 text-xs text-white bg-black/40 px-3 py-1.5 text-center">
              {alt}
            </p>
          )}
        </div>
      );
    }
  }
  return null;
}

// image_gallery: articleIdsを受け取り、それぞれのheroImageIdでグリッド表示
function ImageGalleryPrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const articleIds = safeArray<string>(node.props.articleIds).slice(0, 9);

  const items = articleIds
    .map((id) => {
      const article = ctx.articleIndex[id];
      if (!article?.heroImageId) return null;
      if (!isTrustedImagePath(article.heroImageId)) return null;
      return { id, article, src: article.heroImageId };
    })
    .filter((x): x is { id: string; article: (typeof ctx.articleIndex)[string]; src: string } => x !== null);

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {items.map(({ id, article, src }) => (
        <Link key={id} href={`/posts/${article.slug}`} className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 block">
          <Image
            src={src}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 50vw, 220px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
          <p className="absolute bottom-0 left-0 right-0 text-xs text-white bg-black/50 px-2 py-1 opacity-0 group-hover:opacity-100 transition line-clamp-1">
            {article.title}
          </p>
        </Link>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Rich interactive primitives (using local trusted components)
// Props are validated before passing — AI cannot inject arbitrary code
// ─────────────────────────────────────────────

function AirportAnxietyMapPrimitive({ node }: { node: PrimitiveNode }) {
  const airportName = safeString(node.props.airportName);
  const destinationName = safeString(node.props.destinationName);
  const overallAnxietyLevel = safeNumber(node.props.overallAnxietyLevel, 50, 0, 100);
  const options = safeArray<Record<string, unknown>>(node.props.options)
    .slice(0, 6)
    .map((o) => ({
      mode: safeString(o.mode),
      time: safeString(o.time),
      cost: safeString(o.cost),
      difficulty: safeEnum<"Easy" | "Medium" | "Hard">(o.difficulty, ["Easy", "Medium", "Hard"], "Medium"),
      description: safeString(o.description),
    }))
    .filter((o) => o.mode);
  if (!airportName || !options.length) return null;
  return (
    <AirportAnxietyMap
      airportName={airportName}
      destinationName={destinationName}
      options={options}
      overallAnxietyLevel={overallAnxietyLevel}
    />
  );
}

function BudgetSimulatorPrimitive({ node }: { node: PrimitiveNode }) {
  const destination = safeString(node.props.destination);
  const currency = safeString(node.props.currency) || "円";
  const tiers = safeArray<Record<string, unknown>>(node.props.tiers)
    .slice(0, 5)
    .map((t) => ({
      label: safeString(t.label),
      dailyCost: safeNumber(t.dailyCost, 0, 0, 9999999),
      satisfaction: safeNumber(t.satisfaction, 70, 0, 100),
      description: safeString(t.description),
    }))
    .filter((t) => t.label);
  if (!destination || !tiers.length) return null;
  return <BudgetSimulator destination={destination} currency={currency} tiers={tiers} />;
}

function DestinationComparisonPrimitive({ node }: { node: PrimitiveNode }) {
  const destinationA = safeString(node.props.destinationA);
  const destinationB = safeString(node.props.destinationB);
  const verdict = safeString(node.props.verdict);
  const categories = safeArray<Record<string, unknown>>(node.props.categories)
    .slice(0, 8)
    .map((c) => ({
      name: safeString(c.name),
      ratingA: safeNumber(c.ratingA, 3, 0, 5),
      ratingB: safeNumber(c.ratingB, 3, 0, 5),
      comment: safeString(c.comment),
    }))
    .filter((c) => c.name);
  if (!destinationA || !destinationB || !categories.length) return null;
  return (
    <DestinationComparisonBoard
      destinationA={destinationA}
      destinationB={destinationB}
      categories={categories}
      verdict={verdict}
    />
  );
}

function ItineraryDisplayPrimitive({ node }: { node: PrimitiveNode }) {
  const title = safeString(node.props.title);
  const destination = safeString(node.props.destination);
  const duration = safeString(node.props.duration);
  const days = safeArray<Record<string, unknown>>(node.props.days)
    .slice(0, 10)
    .map((d) => ({
      day: safeNumber(d.day, 1, 1, 30),
      title: safeString(d.title),
      schedule: safeArray<Record<string, unknown>>(d.schedule)
        .slice(0, 10)
        .map((s) => ({
          time: safeString(s.time),
          activity: safeString(s.activity),
          description: safeString(s.description),
          location: safeString(s.location) || undefined,
        }))
        .filter((s) => s.activity),
    }))
    .filter((d) => d.title);
  if (!title || !days.length) return null;
  return <ItineraryDisplay title={title} destination={destination} duration={duration} days={days} />;
}

function PackingListPrimitive({ node }: { node: PrimitiveNode }) {
  const destination = safeString(node.props.destination);
  const season = safeString(node.props.season);
  const items = safeArray<Record<string, unknown>>(node.props.items)
    .slice(0, 30)
    .map((i) => ({
      item: safeString(i.item),
      category: safeString(i.category),
      reason: safeString(i.reason),
      essential: Boolean(i.essential),
    }))
    .filter((i) => i.item && i.category);
  if (!destination || !items.length) return null;
  return <PackingList destination={destination} season={season} items={items} />;
}

function PhotoSpotsPrimitive({ node }: { node: PrimitiveNode }) {
  const destination = safeString(node.props.destination);
  const spots = safeArray<Record<string, unknown>>(node.props.spots)
    .slice(0, 8)
    .map((s) => ({
      name: safeString(s.name),
      theme: safeString(s.theme),
      bestTime: safeString(s.bestTime),
      instagrammability: safeNumber(s.instagrammability, 3, 0, 5),
    }))
    .filter((s) => s.name);
  if (!destination || !spots.length) return null;
  return <PhotoOppsComparison destination={destination} spots={spots} />;
}

function ArticleEmbedderPrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const articleIds = safeArray<string>(node.props.articleIds).slice(0, 6);
  const articles = articleIds
    .map((id) => {
      const a = ctx.articleIndex[id];
      if (!a) return null;
      return { title: a.title, slug: a.slug, summary: a.summaryForAI };
    })
    .filter((a): a is { title: string; slug: string; summary: string } => a !== null);
  if (!articles.length) return null;
  return <ArticleEmbedder articles={articles} />;
}

// src がブログ自身の /images/ パスであることを確認するホワイトリスト検証
function isTrustedImagePath(src: string): boolean {
  return (
    typeof src === "string" &&
    src.startsWith("/images/") &&
    !src.includes("..") &&
    !src.includes("javascript:") &&
    /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(src)
  );
}

function ComparisonTablePrimitive({ node }: { node: PrimitiveNode }) {
  const columns = safeArray<string>(node.props.columns);
  const rows = safeArray<string[]>(node.props.rows);
  if (!columns.length || !rows.length) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-800">
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-700"
              >
                {safeString(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-zinc-50 dark:border-zinc-800 last:border-0">
              {safeArray<string>(row).map((cell, ci) => (
                <td key={ci} className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
                  {safeString(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScoreCardPrimitive({ node }: { node: PrimitiveNode }) {
  const label = safeString(node.props.label);
  const score = safeNumber(node.props.score, 0, 0, 100);
  const description = safeString(node.props.description);
  if (!label) return null;
  return (
    <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</span>
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      {description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
    </div>
  );
}

function CalloutPrimitive({ node }: { node: PrimitiveNode }) {
  const title = safeString(node.props.title);
  const text = safeString(node.props.text);
  const variant = safeEnum(node.props.variant, ["info", "warning", "tip"], "info");
  const styles = {
    info: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    warning: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
    tip: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
  };
  const icons = { info: "ℹ", warning: "⚠", tip: "💡" };
  return (
    <div className={`rounded-xl border p-4 space-y-1 ${styles[variant]}`}>
      {title && (
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {icons[variant]} {title}
        </p>
      )}
      {text && <p className="text-sm text-zinc-700 dark:text-zinc-300">{text}</p>}
    </div>
  );
}

function TabsPrimitive({
  node,
  ctx,
  depth,
}: {
  node: PrimitiveNode;
  ctx: RendererContext;
  depth: number;
}) {
  const children = node.children ?? [];
  const [active, setActive] = React.useState(0);
  if (!children.length) return null;
  const labels = children.map((c, i) => safeString(c.props.label ?? c.props.title ?? `タブ${i + 1}`));
  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {labels.map((label, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`px-3 py-1 text-sm rounded-lg transition ${
              i === active
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>
        <NodeRenderer node={children[active]} ctx={ctx} depth={depth + 1} />
      </div>
    </div>
  );
}

function AccordionPrimitive({
  node,
  ctx,
  depth,
}: {
  node: PrimitiveNode;
  ctx: RendererContext;
  depth: number;
}) {
  const [open, setOpen] = React.useState(false);
  const title = safeString(node.props.title ?? node.props.label);
  return (
    <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
      >
        <span>{title || "詳細"}</span>
        <span className="text-zinc-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 bg-white dark:bg-zinc-900 space-y-2">
          <Children node={node} ctx={ctx} depth={depth} />
        </div>
      )}
    </div>
  );
}

function TimelinePrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const items = safeArray<{ title: string; text?: string; articleId?: string }>(node.props.items);
  if (!items.length) return null;
  return (
    <ol className="space-y-4">
      {items.map((item, i) => {
        const title = safeString(item.title);
        const text = safeString(item.text);
        const articleId = safeString(item.articleId);
        const article = articleId ? ctx.articleIndex[articleId] : null;
        return (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs flex items-center justify-center font-bold flex-shrink-0">
                {i + 1}
              </div>
              {i < items.length - 1 && (
                <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-700 mt-1" />
              )}
            </div>
            <div className="pb-4 space-y-1">
              {article ? (
                <Link
                  href={`/posts/${article.slug}`}
                  className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  {title || article.title}
                </Link>
              ) : (
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</p>
              )}
              {text && <p className="text-xs text-zinc-500 dark:text-zinc-400">{text}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function NextActionPrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const label = safeString(node.props.label ?? node.props.text);
  const articleId = safeString(node.props.articleId);
  const article = articleId ? ctx.articleIndex[articleId] : null;
  if (!label) return null;
  if (article) {
    return (
      <Link
        href={`/posts/${article.slug}`}
        className="flex items-center gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:shadow-sm transition group"
      >
        <div className="flex-1">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">次のステップ</p>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline">
            {label}
          </p>
        </div>
        <span className="text-zinc-400 group-hover:translate-x-0.5 transition-transform">→</span>
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
      <div className="flex-1">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">次のステップ</p>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Safe type helpers — never trust AI-generated props
// ─────────────────────────────────────────────

function safeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").slice(0, 500);
}

function safeNumber(value: unknown, fallback: number, min: number, max: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function safeArray<T>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value as T[];
}

function safeEnum<T extends string>(value: unknown, allowed: T[], fallback: T): T {
  if (typeof value === "string" && (allowed as string[]).includes(value)) return value as T;
  return fallback;
}
