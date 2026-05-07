import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import fs from "fs/promises";
import path from "path";

import { GenerateTopRequestSchema } from "@/features/generative-ui/top/schema";
import { selectCandidateArticles } from "@/features/generative-ui/top/selectCandidateArticles";
import {
  buildGenerateSystemPrompt,
  buildGenerateUserPayload,
} from "@/features/generative-ui/top/buildGeneratePrompt";
import { validateGeneratedSchema } from "@/features/generative-ui/top/validateGeneratedSchema";
import { sanitizeGeneratedSchema } from "@/features/generative-ui/top/sanitizeGeneratedSchema";
import { buildFallbackSchema } from "@/features/generative-ui/top/fallbackSchema";

const BLOG_INDEX_PATH = path.join(process.cwd(), "public", "generated", "blog-index.json");
const TTL_SECONDS = 30 * 60;

let cachedIndex: { version: string; articles: Record<string, unknown>[] } | null = null;

async function loadBlogIndex() {
  if (cachedIndex) return cachedIndex;
  try {
    const raw = await fs.readFile(BLOG_INDEX_PATH, "utf8");
    cachedIndex = JSON.parse(raw);
    return cachedIndex;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const NO_STORE = { "Cache-Control": "no-store" };

  let parsedBody: unknown;
  try {
    parsedBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers: NO_STORE });
  }

  const bodyResult = GenerateTopRequestSchema.safeParse(parsedBody);
  if (!bodyResult.success) {
    return NextResponse.json(
      { error: "Invalid request: " + bodyResult.error.issues.map((i) => i.message).join(", ") },
      { status: 400, headers: NO_STORE }
    );
  }

  const { userInput, device } = bodyResult.data;

  // Load article index
  const index = await loadBlogIndex();
  if (!index) {
    console.error("[generative-ui/generate] Blog index unavailable");
    return NextResponse.json(
      { schema: buildFallbackSchema("記事インデックスが読み込めませんでした"), meta: { generatedAt: Date.now(), ttlSeconds: TTL_SECONDS } },
      { headers: NO_STORE }
    );
  }

  const candidates = selectCandidateArticles(
    index.articles as Parameters<typeof selectCandidateArticles>[0],
    userInput
  );

  const validArticleIds = new Set(candidates.map((a) => a.id));

  const model = google(process.env.GEMINI_MODEL_NAME || "gemini-1.5-flash-latest");
  const systemPrompt = buildGenerateSystemPrompt();
  const userPayload = buildGenerateUserPayload(userInput, candidates, device);

  let aiText: string;
  try {
    const { text } = await generateText({
      model,
      system: systemPrompt,
      messages: [{ role: "user", content: userPayload }],
    });
    aiText = text;
  } catch (e) {
    console.error("[generative-ui/generate] AI call failed:", (e as Error).message);
    return NextResponse.json(
      { schema: buildFallbackSchema(), meta: { generatedAt: Date.now(), ttlSeconds: TTL_SECONDS } },
      { headers: NO_STORE }
    );
  }

  // Parse JSON from AI response
  let rawSchema: unknown;
  try {
    const jsonMatch = aiText.match(/```json\n([\s\S]*?)\n```/) ?? aiText.match(/```\n([\s\S]*?)\n```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : aiText.trim();
    rawSchema = JSON.parse(jsonStr);
  } catch {
    console.error("[generative-ui/generate] JSON parse failed");
    return NextResponse.json(
      { schema: buildFallbackSchema("生成されたUIの解析に失敗しました"), meta: { generatedAt: Date.now(), ttlSeconds: TTL_SECONDS } },
      { headers: NO_STORE }
    );
  }

  // Validate
  const validation = validateGeneratedSchema(rawSchema);
  if (!validation.success) {
    console.error("[generative-ui/generate] Schema validation failed:", validation.error);
    return NextResponse.json(
      { schema: buildFallbackSchema("生成されたUIを安全に表示できませんでした"), meta: { generatedAt: Date.now(), ttlSeconds: TTL_SECONDS } },
      { headers: NO_STORE }
    );
  }

  // Sanitize
  const sanitized = sanitizeGeneratedSchema(validation.data, validArticleIds);

  return NextResponse.json(
    {
      schema: sanitized,
      meta: {
        generatedAt: Date.now(),
        ttlSeconds: TTL_SECONDS,
        model: process.env.GEMINI_MODEL_NAME || "gemini-1.5-flash-latest",
        articleIndexVersion: index.version,
      },
    },
    { headers: NO_STORE }
  );
}
