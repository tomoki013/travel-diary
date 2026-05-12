import { z } from "zod";

// ────────────────────────────────────────────
// Allowed Primitive types (whitelist)
// ────────────────────────────────────────────
export const ALLOWED_PRIMITIVE_TYPES = [
  // Layout
  "section",
  "container",
  "stack",
  "grid",
  "flex_row",
  "flex_col",
  "card",
  "divider",
  "spacer",
  // Typography
  "heading_h1",
  "heading_h2",
  "heading_h3",
  "heading_h4",
  "body_text",
  "caption_text",
  "quote_block",
  "highlight_text",
  // Data Display
  "data_table",
  "key_value_list",
  "progress_bar",
  "rating_stars",
  "tag_list",
  "timeline",
  "comparison_columns",
  // Feedback & Callout
  "alert_box",
  "tip_callout",
  "did_you_know",
  // Navigation & Action
  "primary_button",
  "secondary_button",
  "text_link",
  "action_card",
  // Media
  "image_single",
  "image_gallery",
  "icon_with_text",
  "floating_action",
  "featured_card",
  "hero_section",
  "gradient_text",
  // Legacy/Rich (Keeping for compatibility)
  "article_card",
  "article_list",
  "airport_anxiety_map",
  "budget_simulator",
  "destination_comparison",
  "itinerary_display",
  "packing_list",
  "photo_spots",
  "article_embedder",
] as const;

export const PrimitiveTypeSchema = z.enum(ALLOWED_PRIMITIVE_TYPES);
export type PrimitiveType = z.infer<typeof PrimitiveTypeSchema>;

// ────────────────────────────────────────────
// Intent Analysis (Step 1)
// ────────────────────────────────────────────
export const IntentAnalysisSchema = z.object({
  primaryGoal: z.string().max(200),
  keyConcerns: z.array(z.string().max(100)),
  recommendedTone: z.string().max(100),
  suggestedLayoutStrategy: z.string().max(300),
});

export type IntentAnalysis = z.infer<typeof IntentAnalysisSchema>;

// ────────────────────────────────────────────
// Recursive PrimitiveNode
// ────────────────────────────────────────────
export type PrimitiveNode = {
  id: string;
  type: PrimitiveType;
  props: Record<string, unknown>;
  reason?: string;
  children?: PrimitiveNode[];
};

export const PrimitiveNodeSchema: z.ZodType<PrimitiveNode> = z.lazy(() =>
  z.object({
    id: z.string().min(1).max(80),
    type: PrimitiveTypeSchema,
    props: z.record(z.string(), z.unknown()).default({}),
    reason: z.string().max(200).optional(),
    children: z.array(PrimitiveNodeSchema).max(20).optional(),
  })
);

// ────────────────────────────────────────────
// Layout types
// ────────────────────────────────────────────
export const LayoutTypeSchema = z.enum([
  "anxiety_first",
  "comparison",
  "photo_first",
  "constraint_first",
  "story_path",
  "mixed",
]);
export type LayoutType = z.infer<typeof LayoutTypeSchema>;

// ────────────────────────────────────────────
// Generated Top Page Schema
// ────────────────────────────────────────────
export const GeneratedTopPageSchema = z.object({
  schemaVersion: z.literal("1.0"),
  generationId: z.string().min(1),
  pageTitle: z.string().min(1).max(80),
  pageDescription: z.string().max(180),
  designReason: z.string().max(240),
  layoutType: LayoutTypeSchema,
  sections: z.array(PrimitiveNodeSchema).min(1).max(10),
  usedArticleIds: z.array(z.string()).max(30),
  warnings: z.array(z.string().max(160)).max(5).default([]),
});

export type GeneratedTopPage = z.infer<typeof GeneratedTopPageSchema>;

// ────────────────────────────────────────────
// Safe Article Context (sent to AI)
// ────────────────────────────────────────────
export const SafeArticleContextSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summaryForAI: z.string(),
  themes: z.array(z.string()),
  tags: z.array(z.string()),
  area: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  heroImageId: z.string().optional(),
});

export type SafeArticleContext = z.infer<typeof SafeArticleContextSchema>;

// ────────────────────────────────────────────
// API Request / Response types
// ────────────────────────────────────────────
export const GenerateTopRequestSchema = z.object({
  userInput: z.string().min(1).max(500),
  locale: z.enum(["ja", "en"]).default("ja"),
  device: z.enum(["mobile", "desktop"]).default("mobile"),
});

export type GenerateTopRequest = z.infer<typeof GenerateTopRequestSchema>;

export const GenerateTopResponseSchema = z.object({
  schema: GeneratedTopPageSchema,
  meta: z.object({
    generatedAt: z.number(),
    ttlSeconds: z.number(),
    model: z.string().optional(),
    articleIndexVersion: z.string().optional(),
  }),
});

export type GenerateTopResponse = z.infer<typeof GenerateTopResponseSchema>;

export const PatchTopRequestSchema = z.object({
  instruction: z.string().min(1).max(300),
  currentSchema: GeneratedTopPageSchema,
});

export type PatchTopRequest = z.infer<typeof PatchTopRequestSchema>;

export const PatchTopResponseSchema = z.object({
  schema: GeneratedTopPageSchema,
  meta: z.object({
    generatedAt: z.number(),
    ttlSeconds: z.number(),
    patchSummary: z.string().optional(),
  }),
});

export type PatchTopResponse = z.infer<typeof PatchTopResponseSchema>;
