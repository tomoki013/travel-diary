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
import { cn } from "@/lib/utils";
import {
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Star,
  Wifi,
  MapPin,
  Clock,
  CircleDollarSign,
  Quote,
  Sparkles,
} from "lucide-react";

// ─────────────────────────────────────────────
// Article index lookup
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
    <div className="animate-in fade-in space-y-12 duration-1000">
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
  if (depth > 12) return null;

  switch (node.type) {
    // --- Layout ---
    case "section":
      return <SectionPrimitive node={node} ctx={ctx} depth={depth} />;
    case "container":
      return <ContainerPrimitive node={node} ctx={ctx} depth={depth} />;
    case "stack":
    case "flex_col":
      return <FlexColPrimitive node={node} ctx={ctx} depth={depth} />;
    case "flex_row":
      return <FlexRowPrimitive node={node} ctx={ctx} depth={depth} />;
    case "grid":
      return <GridPrimitive node={node} ctx={ctx} depth={depth} />;
    case "card":
      return <CardPrimitive node={node} ctx={ctx} depth={depth} />;
    case "divider":
      return <DividerPrimitive />;
    case "spacer":
      return <SpacerPrimitive node={node} />;

    // --- Typography ---
    case "heading_h1":
      return <HeadingPrimitive node={node} level={1} />;
    case "heading_h2":
      return <HeadingPrimitive node={node} level={2} />;
    case "heading_h3":
      return <HeadingPrimitive node={node} level={3} />;
    case "heading_h4":
      return <HeadingPrimitive node={node} level={4} />;
    case "body_text":
      return <TextPrimitive node={node} />;
    case "caption_text":
      return <CaptionPrimitive node={node} />;
    case "quote_block":
      return <QuotePrimitive node={node} />;
    case "highlight_text":
      return <HighlightPrimitive node={node} />;
    case "gradient_text":
      return <GradientTextPrimitive node={node} />;

    // --- Data Display ---
    case "data_table":
      return <DataTablePrimitive node={node} />;
    case "key_value_list":
      return <KeyValueListPrimitive node={node} />;
    case "progress_bar":
      return <ProgressBarPrimitive node={node} />;
    case "rating_stars":
      return <RatingStarsPrimitive node={node} />;
    case "tag_list":
      return <TagListPrimitive node={node} />;
    case "timeline":
      return <TimelinePrimitive node={node} ctx={ctx} />;
    case "comparison_columns":
      return <ComparisonColumnsPrimitive node={node} />;

    // --- Feedback & Callout ---
    case "alert_box":
      return <AlertBoxPrimitive node={node} />;
    case "tip_callout":
      return <TipCalloutPrimitive node={node} />;
    case "did_you_know":
      return <DidYouKnowPrimitive node={node} />;

    // --- Navigation & Action ---
    case "primary_button":
      return <ButtonPrimitive node={node} ctx={ctx} variant="primary" />;
    case "secondary_button":
      return <ButtonPrimitive node={node} ctx={ctx} variant="secondary" />;
    case "text_link":
      return <TextLinkPrimitive node={node} ctx={ctx} />;
    case "action_card":
      return <ActionCardPrimitive node={node} ctx={ctx} depth={depth} />;
    case "floating_action":
      return <FloatingActionPrimitive node={node} />;

    // --- Special ---
    case "hero_section":
      return <HeroSectionPrimitive node={node} ctx={ctx} />;
    case "featured_card":
      return <FeaturedCardPrimitive node={node} ctx={ctx} />;

    // --- Media ---
    case "image_single":
      return <ImagePrimitive node={node} ctx={ctx} />;
    case "image_gallery":
      return <ImageGalleryPrimitive node={node} ctx={ctx} />;
    case "icon_with_text":
      return <IconWithTextPrimitive node={node} />;

    // --- Legacy / Rich Components ---
    case "article_card":
      return <ArticleCardPrimitive node={node} ctx={ctx} />;
    case "article_list":
      return <ArticleListPrimitive node={node} ctx={ctx} />;
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

    // Aliases
    case "heading":
      return <HeadingPrimitive node={node} level={safeNumber(node.props.level, 2, 1, 4)} />;
    case "text":
      return <TextPrimitive node={node} />;
    case "button":
      return <ButtonPrimitive node={node} ctx={ctx} />;
    case "badge":
      return <TagListPrimitive node={node} propsTags={[safeString(node.props.label)]} />;
    case "callout":
      return <AlertBoxPrimitive node={node} />;

    default:
      return null;
  }
}

function Children({
  node,
  ctx,
  depth,
}: {
  node: PrimitiveNode;
  ctx: RendererContext;
  depth: number;
}) {
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
// Primitives: Layout
// ─────────────────────────────────────────────

function SectionPrimitive({
  node,
  ctx,
  depth,
}: {
  node: PrimitiveNode;
  ctx: RendererContext;
  depth: number;
}) {
  return (
    <section
      className="relative space-y-10 overflow-hidden rounded-[2.5rem] border border-zinc-200/60 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:p-12 dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:shadow-none"
      data-reason={node.reason}
    >
      <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-amber-400 to-orange-500 opacity-80" />
      <Children node={node} ctx={ctx} depth={depth} />
    </section>
  );
}

function ContainerPrimitive({
  node,
  ctx,
  depth,
}: {
  node: PrimitiveNode;
  ctx: RendererContext;
  depth: number;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 w-full duration-700 ease-out">
      <Children node={node} ctx={ctx} depth={depth} />
    </div>
  );
}

function FlexColPrimitive({
  node,
  ctx,
  depth,
}: {
  node: PrimitiveNode;
  ctx: RendererContext;
  depth: number;
}) {
  const gap = safeNumber(node.props.gap, 6, 0, 16);
  return (
    <div className={cn("flex flex-col")} style={{ gap: `${gap * 0.25}rem` }}>
      <Children node={node} ctx={ctx} depth={depth} />
    </div>
  );
}

function FlexRowPrimitive({
  node,
  ctx,
  depth,
}: {
  node: PrimitiveNode;
  ctx: RendererContext;
  depth: number;
}) {
  const gap = safeNumber(node.props.gap, 4, 0, 12);
  const wrap = node.props.wrap !== false;
  return (
    <div
      className={cn("flex items-center", wrap && "flex-wrap")}
      style={{ gap: `${gap * 0.25}rem` }}
    >
      <Children node={node} ctx={ctx} depth={depth} />
    </div>
  );
}

function GridPrimitive({
  node,
  ctx,
  depth,
}: {
  node: PrimitiveNode;
  ctx: RendererContext;
  depth: number;
}) {
  const cols = safeNumber(node.props.cols, 2, 1, 4);
  const gap = safeNumber(node.props.gap, 6, 0, 16);
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  }[cols as 1 | 2 | 3 | 4];

  return (
    <div className={cn("grid", gridCols)} style={{ gap: `${gap * 0.25}rem` }}>
      <Children node={node} ctx={ctx} depth={depth} />
    </div>
  );
}

function CardPrimitive({
  node,
  ctx,
  depth,
}: {
  node: PrimitiveNode;
  ctx: RendererContext;
  depth: number;
}) {
  const padding = safeEnum(node.props.padding, ["small", "medium", "large"], "medium");
  const pClass = { small: "p-4", medium: "p-6", large: "p-10" }[padding];
  return (
    <div
      className={cn(
        "rounded-3xl border border-zinc-100 bg-white/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:border-zinc-800 dark:bg-zinc-800/40",
        pClass,
      )}
    >
      <Children node={node} ctx={ctx} depth={depth} />
    </div>
  );
}

function DividerPrimitive() {
  return (
    <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />
  );
}

function SpacerPrimitive({ node }: { node: PrimitiveNode }) {
  const size = safeEnum(node.props.size, ["small", "medium", "large"], "medium");
  const h = { small: "h-4", medium: "h-10", large: "h-20" }[size];
  return <div className={h} aria-hidden="true" />;
}

// ─────────────────────────────────────────────
// Primitives: Typography
// ─────────────────────────────────────────────

function HeadingPrimitive({ node, level }: { node: PrimitiveNode; level: number }) {
  const text = safeString(node.props.text);
  if (!text) return null;
  const baseCls = "font-bold tracking-tight font-heading leading-tight";

  if (level === 1)
    return (
      <h1
        className={cn(
          "bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600 bg-clip-text pb-2 text-4xl text-transparent md:text-5xl lg:text-6xl dark:from-white dark:via-zinc-200 dark:to-zinc-400",
          baseCls,
        )}
      >
        {text}
      </h1>
    );
  if (level === 2)
    return (
      <h2
        className={cn(
          "flex items-center gap-3 text-2xl text-zinc-900 md:text-3xl dark:text-zinc-100",
          baseCls,
        )}
      >
        <span className="h-8 w-1.5 rounded-full bg-amber-500" />
        {text}
      </h2>
    );
  if (level === 3)
    return (
      <h3 className={cn("text-xl text-zinc-800 md:text-2xl dark:text-zinc-200", baseCls)}>
        {text}
      </h3>
    );
  return (
    <h4 className={cn("text-base text-zinc-700 md:text-lg dark:text-zinc-300", baseCls)}>{text}</h4>
  );
}

function TextPrimitive({ node }: { node: PrimitiveNode }) {
  const text = safeString(node.props.text);
  if (!text) return null;
  return (
    <p className="text-base leading-relaxed font-medium text-zinc-600 md:text-lg dark:text-zinc-400">
      {text}
    </p>
  );
}

function CaptionPrimitive({ node }: { node: PrimitiveNode }) {
  const text = safeString(node.props.text);
  if (!text) return null;
  return <p className="text-xs text-zinc-500 italic dark:text-zinc-500">{text}</p>;
}

function QuotePrimitive({ node }: { node: PrimitiveNode }) {
  const text = safeString(node.props.text);
  const author = safeString(node.props.author);
  if (!text) return null;
  return (
    <blockquote className="space-y-2 border-l-4 border-zinc-200 py-2 pl-6 dark:border-zinc-700">
      <Quote className="mb-2 h-6 w-6 text-zinc-300 dark:text-zinc-600" />
      <p className="text-lg leading-relaxed font-medium text-zinc-800 italic dark:text-zinc-200">
        {text}
      </p>
      {author && <cite className="block text-sm text-zinc-500 not-italic">— {author}</cite>}
    </blockquote>
  );
}

function HighlightPrimitive({ node }: { node: PrimitiveNode }) {
  const text = safeString(node.props.text);
  const color = safeEnum(node.props.color, ["amber", "emerald", "blue", "rose"], "amber");
  const colors = {
    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200",
    emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200",
    rose: "bg-rose-100 dark:bg-rose-900/30 text-rose-900 dark:text-rose-200",
  };
  if (!text) return null;
  return <span className={cn("rounded px-1.5 py-0.5 font-medium", colors[color])}>{text}</span>;
}

function GradientTextPrimitive({ node }: { node: PrimitiveNode }) {
  const text = safeString(node.props.text);
  const from = safeEnum(node.props.from, ["amber", "emerald", "blue", "rose", "indigo"], "amber");
  const to = safeEnum(node.props.to, ["amber", "emerald", "blue", "rose", "orange"], "rose");

  const gradients = {
    amber: "from-amber-500",
    emerald: "from-emerald-500",
    blue: "from-blue-500",
    rose: "from-rose-500",
    indigo: "from-indigo-500",
    orange: "to-orange-500",
  };

  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text font-bold text-transparent",
        gradients[from as keyof typeof gradients],
        gradients[to as keyof typeof gradients],
      )}
    >
      {text}
    </span>
  );
}

// ─────────────────────────────────────────────
// Primitives: Data Display
// ─────────────────────────────────────────────

function DataTablePrimitive({ node }: { node: PrimitiveNode }) {
  const columns = safeArray<string>(node.props.columns);
  const rows = safeArray<string[]>(node.props.rows);
  if (!columns.length || !rows.length) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-800/50">
            {columns.map((col, i) => (
              <th
                key={i}
                className="border-b border-zinc-200 px-4 py-3 text-left font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
              >
                {safeString(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30"
            >
              {safeArray<string>(row).map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
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

function KeyValueListPrimitive({ node }: { node: PrimitiveNode }) {
  const items = safeArray<{ label: string; value: string }>(node.props.items);
  if (!items.length) return null;
  return (
    <dl className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-baseline justify-between gap-4 border-b border-zinc-100 py-1.5 last:border-0 dark:border-zinc-800"
        >
          <dt className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-500">
            {safeString(item.label)}
          </dt>
          <dd className="text-right text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {safeString(item.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ProgressBarPrimitive({ node }: { node: PrimitiveNode }) {
  const label = safeString(node.props.label);
  const value = safeNumber(node.props.value, 0, 0, 100);
  const color = safeEnum(node.props.color, ["amber", "emerald", "blue", "rose"], "amber");
  const barColors = {
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    rose: "bg-rose-500",
  };
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">{label}</span>
        <span className="font-mono text-zinc-500">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className={cn("h-full transition-all duration-1000", barColors[color])}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RatingStarsPrimitive({ node }: { node: PrimitiveNode }) {
  const rating = safeNumber(node.props.rating, 0, 0, 5);
  const label = safeString(node.props.label);
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{label}</span>}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={cn(
              "h-4 w-4",
              s <= rating
                ? "fill-amber-400 text-amber-400"
                : s - 0.5 <= rating
                  ? "fill-amber-400/50 text-amber-400"
                  : "text-zinc-200 dark:text-zinc-700",
            )}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-zinc-500">{rating.toFixed(1)}</span>
    </div>
  );
}

function TagListPrimitive({ node, propsTags }: { node: PrimitiveNode; propsTags?: string[] }) {
  const tags = propsTags || safeArray<string>(node.props.tags);
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold tracking-widest text-zinc-600 uppercase dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
        >
          {safeString(tag)}
        </span>
      ))}
    </div>
  );
}

function ComparisonColumnsPrimitive({ node }: { node: PrimitiveNode }) {
  const left = node.props.left as { title: string; items: string[] };
  const right = node.props.right as { title: string; items: string[] };
  if (!left || !right) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/30">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
          <ChevronRight className="h-4 w-4 text-emerald-500" />
          {safeString(left.title)}
        </h4>
        <ul className="space-y-2">
          {safeArray<string>(left.items).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              {safeString(item)}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/30">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
          <ChevronRight className="h-4 w-4 text-amber-500" />
          {safeString(right.title)}
        </h4>
        <ul className="space-y-2">
          {safeArray<string>(right.items).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              {safeString(item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Primitives: Feedback & Callout
// ─────────────────────────────────────────────

function AlertBoxPrimitive({ node }: { node: PrimitiveNode }) {
  const variant = safeEnum(node.props.variant, ["info", "success", "warning", "error"], "info");
  const title = safeString(node.props.title);
  const text = safeString(node.props.text);

  const styles = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-900 dark:text-blue-200",
      icon: <Info className="h-5 w-5 text-blue-500" />,
    },
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-900 dark:text-emerald-200",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-900 dark:text-amber-200",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    },
    error: {
      bg: "bg-rose-50 dark:bg-rose-900/20",
      border: "border-rose-200 dark:border-rose-800",
      text: "text-rose-900 dark:text-rose-200",
      icon: <XCircle className="h-5 w-5 text-rose-500" />,
    },
  };

  const style = styles[variant];

  return (
    <div
      className={cn(
        "animate-in zoom-in-95 flex gap-4 rounded-2xl border p-5 duration-500",
        style.bg,
        style.border,
      )}
    >
      <div className="shrink-0">{style.icon}</div>
      <div className="space-y-1">
        {title && <p className={cn("text-sm font-bold", style.text)}>{title}</p>}
        {text && <p className={cn("text-sm opacity-90", style.text)}>{text}</p>}
      </div>
    </div>
  );
}

function TipCalloutPrimitive({ node }: { node: PrimitiveNode }) {
  const text = safeString(node.props.text);
  if (!text) return null;
  return (
    <div className="flex gap-4 rounded-2xl bg-amber-500 p-5 text-white shadow-md shadow-amber-500/20">
      <div className="h-fit shrink-0 rounded-full bg-white/20 p-2">
        <Lightbulb className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-widest uppercase opacity-80">Pro Tip</p>
        <p className="text-sm leading-relaxed font-medium">{text}</p>
      </div>
    </div>
  );
}

function DidYouKnowPrimitive({ node }: { node: PrimitiveNode }) {
  const title = safeString(node.props.title || "ご存知ですか？");
  const text = safeString(node.props.text);
  if (!text) return null;
  return (
    <div className="space-y-3 rounded-2xl border-2 border-dashed border-zinc-200 p-6 dark:border-zinc-800">
      <div className="flex items-center gap-2 text-zinc-400">
        <HelpCircle className="h-5 w-5" />
        <span className="text-xs font-bold tracking-widest uppercase">{title}</span>
      </div>
      <p className="text-sm leading-relaxed text-zinc-600 italic dark:text-zinc-400">{text}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Primitives: Navigation & Action
// ─────────────────────────────────────────────

function ButtonPrimitive({
  node,
  ctx,
  variant = "primary",
}: {
  node: PrimitiveNode;
  ctx: RendererContext;
  variant?: "primary" | "secondary";
}) {
  const label = safeString(node.props.label || node.props.text);
  const articleId = safeString(node.props.articleId);
  if (!label) return null;

  const baseCls =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95";
  const variants = {
    primary:
      "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/20 dark:shadow-none hover:opacity-90",
    secondary:
      "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800",
  };

  const article = articleId ? ctx.articleIndex[articleId] : null;

  if (article) {
    return (
      <Link href={`/posts/${article.slug}`} className={cn(baseCls, variants[variant])}>
        {label}
        <ChevronRight className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <button type="button" className={cn(baseCls, variants[variant])}>
      {label}
    </button>
  );
}

function TextLinkPrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const label = safeString(node.props.label || node.props.text);
  const articleId = safeString(node.props.articleId);
  if (!label) return null;

  const article = articleId ? ctx.articleIndex[articleId] : null;

  if (article) {
    return (
      <Link
        href={`/posts/${article.slug}`}
        className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 decoration-2 underline-offset-4 hover:underline dark:text-amber-500"
      >
        {label}
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    );
  }

  return <span className="text-sm font-bold text-zinc-400">{label}</span>;
}

function ActionCardPrimitive({
  node,
  ctx,
  depth,
}: {
  node: PrimitiveNode;
  ctx: RendererContext;
  depth: number;
}) {
  const title = safeString(node.props.title);
  const description = safeString(node.props.description);
  const articleId = safeString(node.props.articleId);

  const article = articleId ? ctx.articleIndex[articleId] : null;
  const content = (
    <div className="flex items-center justify-between gap-4 p-5">
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-widest text-amber-600 uppercase dark:text-amber-500">
          Next Step
        </p>
        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {title || article?.title}
        </h4>
        {description && <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition-colors group-hover:bg-amber-500 group-hover:text-white dark:bg-zinc-800">
        <ChevronRight className="h-5 w-5" />
      </div>
    </div>
  );

  if (article) {
    return (
      <Link
        href={`/posts/${article.slug}`}
        className="group block overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all hover:border-amber-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
      {content}
    </div>
  );
}

function FloatingActionPrimitive({ node }: { node: PrimitiveNode }) {
  const label = safeString(node.props.label);
  return (
    <button className="group fixed right-8 bottom-8 z-[100] flex items-center gap-3 rounded-full bg-zinc-900 px-6 py-4 font-bold text-white shadow-2xl transition-all hover:scale-110 active:scale-95 dark:bg-white dark:text-zinc-900">
      <div className="h-2 w-2 animate-ping rounded-full bg-amber-500" />
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────
// Primitives: Special
// ─────────────────────────────────────────────

function HeroSectionPrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const title = safeString(node.props.title);
  const subtitle = safeString(node.props.subtitle);
  const articleId = safeString(node.props.articleId);
  const article = articleId ? ctx.articleIndex[articleId] : null;
  const image = article?.heroImageId;

  return (
    <div className="group relative flex min-h-[400px] w-full items-center justify-center overflow-hidden rounded-[3rem] shadow-2xl">
      {image && isTrustedImagePath(image) ? (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
      )}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-all group-hover:backdrop-blur-none" />
      <div className="relative z-10 max-w-3xl space-y-6 px-6 py-12 text-center">
        <h1 className="font-heading animate-in fade-in zoom-in-95 text-4xl leading-tight font-bold text-white drop-shadow-lg duration-1000 md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="animate-in fade-in slide-in-from-bottom-4 text-lg font-medium text-zinc-100 drop-shadow-md delay-300 duration-1000 md:text-xl">
            {subtitle}
          </p>
        )}
        {article && (
          <div className="animate-in fade-in slide-in-from-bottom-8 pt-4 delay-500 duration-1000">
            <Link
              href={`/posts/${article.slug}`}
              className="inline-block rounded-full bg-white px-8 py-4 font-bold text-zinc-900 shadow-xl transition-all hover:scale-105 hover:bg-amber-500 hover:text-white"
            >
              冒険を始める
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedCardPrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const title = safeString(node.props.title);
  const description = safeString(node.props.description);
  const badge = safeString(node.props.badge);
  const articleId = safeString(node.props.articleId);
  const article = articleId ? ctx.articleIndex[articleId] : null;

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
      <div className="space-y-4 p-8">
        {badge && (
          <span className="inline-block rounded-full bg-amber-500 px-4 py-1 text-xs font-bold tracking-widest text-white uppercase shadow-md">
            {badge}
          </span>
        )}
        <h3 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {title || article?.title}
        </h3>
        <p className="leading-relaxed font-medium text-zinc-600 dark:text-zinc-400">
          {description || article?.summaryForAI}
        </p>
        {article && (
          <Link
            href={`/posts/${article.slug}`}
            className="flex items-center gap-2 font-bold text-amber-600 transition-all hover:gap-3 dark:text-amber-500"
          >
            詳しく見る <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="h-24 w-24 rotate-12 text-amber-500" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Primitives: Media
// ─────────────────────────────────────────────

function IconWithTextPrimitive({ node }: { node: PrimitiveNode }) {
  const text = safeString(node.props.text);
  const iconName = safeString(node.props.icon).toLowerCase();

  const Icons = {
    wifi: <Wifi className="h-4 w-4" />,
    map: <MapPin className="h-4 w-4" />,
    clock: <Clock className="h-4 w-4" />,
    dollar: <CircleDollarSign className="h-4 w-4" />,
    star: <Star className="h-4 w-4" />,
  };

  const Icon = Icons[iconName as keyof typeof Icons] || <ChevronRight className="h-4 w-4" />;

  return (
    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
      <div className="text-amber-500">{Icon}</div>
      <span className="text-xs font-bold">{text}</span>
    </div>
  );
}

function ImagePrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const articleId = safeString(node.props.articleId);
  const caption = safeString(node.props.caption || node.props.alt || "");

  if (articleId) {
    const article = ctx.articleIndex[articleId];
    const src = article?.heroImageId;
    if (src && isTrustedImagePath(src)) {
      return (
        <div className="space-y-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-800">
            <Image
              src={src}
              alt={caption || article.title}
              fill
              sizes="(max-width: 640px) 100vw, 672px"
              className="object-cover"
            />
          </div>
          {caption && <p className="text-center text-xs text-zinc-400 italic">{caption}</p>}
        </div>
      );
    }
  }
  return null;
}

function ImageGalleryPrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const articleIds = safeArray<string>(node.props.articleIds).slice(0, 9);

  const items = articleIds
    .map((id) => {
      const article = ctx.articleIndex[id];
      if (!article?.heroImageId) return null;
      if (!isTrustedImagePath(article.heroImageId)) return null;
      return { id, article, src: article.heroImageId };
    })
    .filter(
      (x): x is { id: string; article: (typeof ctx.articleIndex)[string]; src: string } =>
        x !== null,
    );

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map(({ id, article, src }) => (
        <Link
          key={id}
          href={`/posts/${article.slug}`}
          className="group relative block aspect-square overflow-hidden rounded-2xl bg-zinc-100 shadow-sm dark:bg-zinc-800"
        >
          <Image
            src={src}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 50vw, 220px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <p className="absolute right-0 bottom-0 left-0 line-clamp-2 translate-y-2 transform p-3 text-[10px] font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {article.title}
          </p>
        </Link>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Legacy Interactive Primitives
// ─────────────────────────────────────────────

function ArticleCardPrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const articleId = safeString(node.props.articleId);
  if (!articleId) return null;
  const article = ctx.articleIndex[articleId];
  if (!article) return null;
  return (
    <Link
      href={`/posts/${article.slug}`}
      className="group block rounded-2xl border border-zinc-100 bg-white p-5 transition-all hover:border-amber-500/30 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="space-y-2">
        <p className="line-clamp-2 text-sm leading-snug font-bold text-zinc-900 transition-colors group-hover:text-amber-600 dark:text-zinc-100">
          {article.title}
        </p>
        {article.summaryForAI && (
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
            {article.summaryForAI}
          </p>
        )}
      </div>
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
    <ul className="space-y-3">
      {articles.map(({ id, article }) => (
        <li key={id}>
          <Link
            href={`/posts/${article?.slug}`}
            className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs text-zinc-400 italic transition-colors group-hover:bg-amber-100 group-hover:text-amber-600 dark:bg-zinc-800">
                ›
              </span>
              <span className="line-clamp-1 text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100">
                {article?.title}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function TimelinePrimitive({ node, ctx }: { node: PrimitiveNode; ctx: RendererContext }) {
  const items = safeArray<{ title: string; text?: string; time?: string; articleId?: string }>(
    node.props.items,
  );
  if (!items.length) return null;
  return (
    <ol className="relative ml-3 space-y-8 border-l border-zinc-200 dark:border-zinc-800">
      {items.map((item, i) => {
        const title = safeString(item.title);
        const text = safeString(item.text);
        const time = safeString(item.time);
        const articleId = safeString(item.articleId);
        const article = articleId ? ctx.articleIndex[articleId] : null;
        return (
          <li key={i} className="mb-0 ml-6">
            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 ring-8 ring-white dark:bg-zinc-100 dark:ring-zinc-950">
              <span className="text-[10px] font-bold text-white italic dark:text-zinc-900">
                {i + 1}
              </span>
            </span>
            <div className="space-y-1">
              {time && (
                <time className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                  {time}
                </time>
              )}
              <div className="flex flex-col gap-1">
                {article ? (
                  <Link
                    href={`/posts/${article.slug}`}
                    className="text-sm font-bold text-zinc-900 underline decoration-zinc-200 underline-offset-4 hover:text-amber-600 md:text-base dark:text-zinc-100 dark:decoration-zinc-800"
                  >
                    {title || article.title}
                  </Link>
                ) : (
                  <p className="text-sm font-bold text-zinc-900 md:text-base dark:text-zinc-100">
                    {title}
                  </p>
                )}
                {text && (
                  <p className="text-xs leading-relaxed text-zinc-500 md:text-sm dark:text-zinc-400">
                    {text}
                  </p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

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
      difficulty: safeEnum<"Easy" | "Medium" | "Hard">(
        o.difficulty,
        ["Easy", "Medium", "Hard"],
        "Medium",
      ),
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
  return (
    <ItineraryDisplay title={title} destination={destination} duration={duration} days={days} />
  );
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

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function isTrustedImagePath(src: string): boolean {
  return (
    typeof src === "string" &&
    src.startsWith("/images/") &&
    !src.includes("..") &&
    !src.includes("javascript:") &&
    /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(src)
  );
}

function safeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").slice(0, 1000);
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
