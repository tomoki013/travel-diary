import { NextRequest, NextResponse } from "next/server";
import { CoreMessage, generateText } from "ai";
import { google } from "@ai-sdk/google";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

// --- Post Cache Logic ---
const postsCachePath = path.join(process.cwd(), ".posts.cache.json");
let postsCache: Record<string, string> | null = null;

async function loadCache() {
  if (postsCache) return;
  try {
    const data = await fs.readFile(postsCachePath, "utf8");
    postsCache = JSON.parse(data);
    console.log("✅ API Route: Posts cache loaded successfully.");
  } catch {
    console.warn(
      "API Route: Failed to load posts cache. Will build from source."
    );
    postsCache = null;
  }
}

async function buildCacheFromSource() {
  try {
    const postsDir = path.join(process.cwd(), "posts");
    const stat = await fs.stat(postsDir).catch(() => null);
    if (!stat || !stat.isDirectory()) {
      console.warn(`API Route: Posts directory not found at ${postsDir}`);
      return;
    }
    const files = await fs.readdir(postsDir);
    const mdFiles = files.filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
    const built: Record<string, string> = {};
    for (const file of mdFiles) {
      const slug = file.replace(/\.(md|mdx)$/, "").toLowerCase();
      const fileContents = await fs.readFile(path.join(postsDir, file), "utf8");
      const { content } = matter(fileContents);
      built[slug] = content;
    }
    if (Object.keys(built).length > 0) {
      postsCache = built;
      console.log("✅ API Route: Built posts cache from posts fallback.");
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("❌ API Route: Failed to build posts cache:", msg);
  }
}

async function getPostsCache() {
  if (!postsCache) await loadCache();
  if (!postsCache) await buildCacheFromSource();
  return postsCache;
}

// --- System Prompt Builders ---

// Step 1: Extract Requirements
function buildExtractRequirementsPrompt() {
  return `ユーザーの入力から、旅行の重要な要素（目的地、期間、興味、予算など）をJSON形式で抽出しなさい。ユーザー入力に明示されていない項目は省略すること。
出力はJSONオブジェクトのみとし、他のテキストは含めないこと。
例:
{
  "destination": "東京",
  "duration": "3日間",
  "interests": "アート、美味しいもの",
  "budget": "指定なし"
}`;
}

// Step 2: Summarize relevant articles
function buildSummarizeArticlesPrompt(
  requirements: string,
  articleContent: string
) {
  return `あなたはアシスタントです。以下の「旅行の要件」を考慮して、「記事のコンテンツ」から関連情報のみを抽出し、簡潔に要約してください。

### 旅行の要件
${requirements}

### 記事のコンテンツ
${articleContent}

### 指示
- 記事の中から、旅行の要件に合致する場所、アクティビティ、レストラン、交通手段、ヒントなどを具体的に抜き出してください。
- 各情報は箇条書きなどの分かりやすい形式でまとめてください。
- 元の記事にない情報は含めないでください。
- 全体として、後の旅行プラン作成の参考資料となるように、要点をまとめてください。
`;
}

// Step 3: Draft a skeleton itinerary
function buildDraftItineraryPrompt(
  requirements: string,
  summarizedKnowledgeBase: string,
  budget: string
) {
  const budgetInstruction = budget
    ? `**予算:** ユーザーは「${budget}」レベルの予算感を希望しています。高価なアクティビティばかりにならないよう、予算に合った場所やアクティビティを提案してください。`
    : "";

  return `あなたは創造的な旅行プランナーです。あなたの仕事は、ユーザーの「旅行の要件」と、参考情報としての「情報の要約」を基に、ユニークで魅力的な旅行プランの骨子をJSON形式で作成することです。

### 絶対的なルール:
- **出力はJSONのみ:** 会話や挨拶、その他のテキストは一切含めず、指定されたJSONオブジェクトのみを生成してください。
- **スキーマの遵守:** 下記のJSON構造を厳密に守ってください。時間、費用、緯度経度などの詳細情報は**含めないでください**。
- **文字数制限:** descriptionフィールドは最大100文字で記述してください。
- **創造性の発揮:** 「情報の要約」はあくまでインスピレーションの源です。内容をそのままなぞるのではなく、あなた独自の視点で、創造的で魅力的なプランを提案してください。
${budgetInstruction}

---
### 旅行の要件
${requirements}
---
### 参考情報（インスピレーション）
${summarizedKnowledgeBase}
---
### JSON出力形式
\`\`\`json
{
  "itinerary": {
    "title": "（例：アートとグルメを巡る東京3日間の旅）",
    "description": "（旅行プランの簡単な説明）",
    "days": [
      {
        "day": 1,
        "title": "（例：上野・浅草エリア散策）",
        "schedule": [
          { "activity": "（例：上野の森美術館でアート鑑賞）" },
          { "activity": "（例：浅草で食べ歩きと浅草寺参拝）" }
        ]
      }
    ]
  }
}
\`\`\`
`;
}

// Step 4: Flesh out details for a single day
function buildFleshOutDayPrompt(
  dayData: string,
  requirementsData: string,
  summarizedKnowledgeBase: string,
  budget: string
) {
  const budgetInstruction = budget
    ? `**重要:** ユーザーの希望予算は「${budget}」レベルです。この日のアクティビティ全体の費用が、この予算感から大きく外れないように、費用の見積もり(\`cost\`)を調整してください。`
    : "";

  return `あなたは創造的で経験豊富な旅行プランナーです。あなたの仕事は、提供された情報に独自の視点を加えて、1日分の旅行プランをJSON形式で詳細化することです。

### 指示
1.  以下の「1日分の骨子データ」、「旅行全体の要件」、「参考情報（インスピレーション）」を注意深く読み込みます。
2.  これらの情報を出発点として、あなた自身の創造性を発揮し、プランをより魅力的なものにしてください。
3.  各アクティビティに、具体的な時間(time)、詳細な説明(details)、費用(cost)、場所(location)を追加します。
4.  場所(location)には、必ず緯度(latitude)と経度(longitude)を含めます。不明な場合は、おおよその値を推定してください。
5.  その日のすべてのアクティビティの費用を合計し、1日分の予算(budget)を計算します。
6.  あなたの言葉で、ユーザーがわくわくするような、自然で魅力的な説明文を作成します。
${budgetInstruction}

### 絶対的なルール
- **出力形式:** 生成するレスポンスは、**JSONオブジェクトのみ**でなければなりません。会話、挨拶、Markdownのバッククォート(\`)や \`json\` というプレフィックス、その他のテキストは**一切含めないでください**。
- **スキーマの遵守:** 下記の「JSON出力形式」を**厳密に**守ってください。プロパティの追加や削除、データ型の変更は許可されません。
- **値の保証:** すべてのプロパティに具体的な値を入れてください。特に\`cost\`や\`budget\`が不明な場合は \`0\` としてください。
- **説明の簡潔さ:** "details"プロパティの文章は、**最大100文字で**記述してください。これにより応答速度が向上します。

---
### 1日分の骨子データ (dayData)
${dayData}
---
### 旅行全体の要件 (requirementsData)
${requirementsData}
---
### 参考情報（インスピレーション）
${summarizedKnowledgeBase}
---
### JSON出力形式 (1日分のDayオブジェクト)
{
  "day": 1,
  "title": "1日目のテーマやタイトル",
  "budget": 12345,
  "schedule": [
    {
      "time": "HH:MM",
      "activity": "アクティビティ名",
      "details": "アクティビティの詳細な説明文。なぜこの場所が要件に合っているか、何が体験できるかなど。",
      "cost": 1234,
      "location": {
        "name": "場所の名前",
        "latitude": 35.681236,
        "longitude": 139.767125
      }
    }
  ]
}
`;
}

// Step 5: Calculate Final Budget
function buildCalculateBriefBudgetPrompt(draftItinerary: string, budget: string) {
  const budgetInstruction = budget
    ? `ユーザーの希望予算は「${budget}」レベルです。この予算感を考慮して、費用の見積もりを行ってください。`
    : "ユーザーは予算を指定していません。";

  return `あなたは旅行費用のアナリストです。以下の「旅程の骨子」のJSONデータを分析し、非常に大まかな費用の合計と簡単なコメントを計算してください。

### 指示
1.  **アクティビティ数のカウント:** 旅程内のすべての日（days）に含まれるアクティビティ（schedule）の総数を数えます。
2.  **期間の把握:** 旅程の日数（daysの数）を把握します。
3.  **概算予算の算出:** アクティビティ数、日数、およびユーザーの希望予算レベル（${budgetInstruction}）を基に、全体の合計予算(\`total\`)をざっくりと見積もってください。これは非常にラフな推定で構いません。
4.  **コメントの生成:** なぜその予算になったのか、非常に簡単な理由を\`comment\`として記述してください。
5.  **出力:** 最終的な結果を、指定された「JSON出力形式」で返します。

### 絶対的なルール
- **出力形式:** 生成するレスポンスは、**JSONオブジェクトのみ**でなければなりません。会話、挨拶、その他のテキストは一切含めないでください。
- **スキーマの遵守:** 下記のJSON構造を厳密に守ってください。カテゴリー分けは不要です。
- **計算の単純化:** 詳細な計算は不要です。あくまで概算を提示してください。

---
### 旅程の骨子 (draftItinerary)
${draftItinerary}
---
### JSON出力形式
{
  "total": 123456,
  "comment": "（例：X日間の旅行でY個のアクティビティを考慮し、[経済的/標準/豪華]レベルの予算として概算しました。）"
}
`;
}

function buildCalculateFinalBudgetPrompt(
  finalItinerary: string,
  budget: string
) {
  const budgetInstruction = budget
    ? `ユーザーの希望予算は「${budget}」レベルでした。算出された合計費用とこの希望を比較し、簡単なコメント(\`comment\`)を追加してください。`
    : "";

  return `あなたは旅行費用のアナリストです。以下の「最終旅程案」のJSONデータを分析し、費用の合計とカテゴリー別の内訳を計算してください。

### 指示
1.  **合計予算の計算:** 旅程内の各日の\`budget\`プロパティの値を単純に合計し、全体の合計予算(\`total\`)としてください。**個々のアクティビティ費用(\`cost\`)から再計算しないでください。**
2.  **カテゴリー分類:** 旅程内のすべての\`schedule\`に含まれるアクティビティを分析し、各アクティビティの\`cost\`を「宿泊費」「食費」「交通費」「観光・アクティビティ」「その他」のいずれかに分類します。
3.  **カテゴリー別小計:** 分類したカテゴリーごとに費用の小計(\`amount\`)を計算します。
4.  **整合性チェック:** カテゴリー別の小計をすべて合計した金額が、ステップ1で計算した合計予算(\`total\`)と完全に一致することを確認してください。
5.  **出力:** 最終的な結果を、指定された「JSON出力形式」で返します。
${budgetInstruction}

### 絶対的なルール
- **出力形式:** 生成するレスポンスは、**JSONオブジェクトのみ**でなければなりません。会話、挨拶、その他のテキストは一切含めないでください。
- **スキーマの遵守:** 下記のJSON構造を厳密に守ってください。
- **計算の正確性:** 指示に厳密に従い、計算間違いがないようにしてください。

---
### 最終旅程案 (finalItinerary)
${finalItinerary}
---
### JSON出力形式
{
  "total": 123456,
  "categories": [
    { "category": "宿泊費", "amount": 50000 },
    { "category": "食費", "amount": 30000 },
    { "category": "交通費", "amount": 20000 },
    { "category": "観光・アクティビティ", "amount": 23456 },
    { "category": "その他", "amount": 10000 }
  ],
  "comment": "（例：ご希望の「標準」的な予算内に収まるプランです。現地でのショッピングなども楽しめるでしょう。）"
}
`;
}

interface ChatRequestBody {
  messages: CoreMessage[];
  articleSlugs?: string[];
  articleSlug?: string;
  countryName: string;
  step:
    | "extract_requirements"
    | "summarize_articles"
    | "summarize_one_article"
    | "draft_itinerary"
    | "flesh_out_one_day"
    | "calculate_final_budget"
    | "calculate_brief_budget";
  previous_data?: string;
  requirementsData?: string;
  summarizedKnowledgeBase?: string;
  dayData?: string; // For flesh_out_one_day
  finalItinerary?: string; // For calculate_final_budget
  budget?: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatRequestBody;
  console.log("✅ /api/chat: Received request", {
    step: body.step,
    country: body.countryName,
  });

  try {
    const {
      messages,
      step,
      requirementsData,
      summarizedKnowledgeBase,
      dayData,
      finalItinerary,
      articleSlug,
      previous_data,
      budget,
    } = body;
    const userMessages = messages.filter((m) => m.role === "user");
    const model = google(
      process.env.GEMINI_MODEL_NAME || "gemini-1.5-flash-latest"
    );

    // A utility to safely parse JSON from AI response
    const parseJsonResponse = (aiResponse: string) => {
      try {
        const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
        return JSON.parse(jsonString);
      } catch (e) {
        console.error(
          "❌ API Route: Failed to parse JSON response from AI.",
          e,
          "AI Response:",
          aiResponse
        );
        throw new Error("AIからの応答が不正なJSON形式でした。");
      }
    };

    switch (step) {
      case "extract_requirements": {
        console.log("  -> Executing step: extract_requirements");
        const systemPrompt = buildExtractRequirementsPrompt();
        const { text } = await generateText({
          model,
          system: systemPrompt,
          messages: userMessages,
        });
        console.log(
          "    - AI call successful. Returning extracted requirements."
        );
        return NextResponse.json({ response: text });
      }

      case "summarize_one_article": {
        console.log("  -> Executing step: summarize_one_article");
        if (!articleSlug || !requirementsData) {
          return NextResponse.json(
            {
              error:
                "Step 'summarize_one_article' requires 'articleSlug' and 'requirementsData'.",
            },
            { status: 400 }
          );
        }
        const cache = await getPostsCache();
        if (!cache) {
          return NextResponse.json(
            { error: "Server not ready: Could not load post cache." },
            { status: 503 }
          );
        }
        const lowerCasePostsCache = Object.fromEntries(
          Object.entries(cache).map(([k, v]) => [k.toLowerCase(), v])
        );
        const articleContent = lowerCasePostsCache[articleSlug.toLowerCase()];
        if (!articleContent) {
          return NextResponse.json(
            { error: `Article '${articleSlug}' not found.` },
            { status: 404 }
          );
        }
        const systemPrompt = buildSummarizeArticlesPrompt(
          requirementsData,
          articleContent
        );
        const { text } = await generateText({
          model,
          system: systemPrompt,
          messages: [{ role: "user", content: "Continue." }],
        });
        console.log("    - AI call successful. Returning summary.");
        return NextResponse.json({ summary: text });
      }

      case "summarize_articles": {
        console.warn(
          "  -> WARNING: Deprecated 'summarize_articles' step was called."
        );
        return NextResponse.json(
          {
            error:
              "This step is deprecated. Use 'summarize_one_article' instead.",
          },
          { status: 410 }
        );
      }

      case "draft_itinerary": {
        console.log("  -> Executing step: draft_itinerary");
        if (!previous_data || !requirementsData) {
          return NextResponse.json(
            {
              error:
                "Step 'draft_itinerary' requires 'previous_data' (summary) and 'requirementsData'.",
            },
            { status: 400 }
          );
        }
        const systemPrompt = buildDraftItineraryPrompt(
          requirementsData,
          previous_data,
          budget || ""
        );
        const { text } = await generateText({
          model,
          system: systemPrompt,
          messages: [{ role: "user", content: "Continue." }],
        });
        console.log(
          "    - AI call successful. Parsing and returning draft plan JSON."
        );
        const parsedJson = parseJsonResponse(text);
        return NextResponse.json(parsedJson);
      }

      case "flesh_out_one_day": {
        console.log("  -> Executing step: flesh_out_one_day");
        if (!dayData || !requirementsData || !summarizedKnowledgeBase) {
          return NextResponse.json(
            {
              error:
                "Step 'flesh_out_one_day' requires 'dayData', 'requirementsData', and 'summarizedKnowledgeBase'.",
            },
            { status: 400 }
          );
        }
        const systemPrompt = buildFleshOutDayPrompt(
          dayData,
          requirementsData,
          summarizedKnowledgeBase,
          budget || ""
        );
        console.log("    - Calling Google AI for single day detail...");
        const { text } = await generateText({
          model,
          system: systemPrompt,
          messages: [{ role: "user", content: "Continue." }],
        });
        console.log(
          "    - AI call successful. Parsing and returning day JSON."
        );
        const parsedJson = parseJsonResponse(text);
        return NextResponse.json(parsedJson);
      }

      case "calculate_final_budget": {
        console.log("  -> Executing step: calculate_final_budget");
        if (!finalItinerary) {
          return NextResponse.json(
            {
              error: "Step 'calculate_final_budget' requires 'finalItinerary'.",
            },
            { status: 400 }
          );
        }
        const systemPrompt = buildCalculateFinalBudgetPrompt(
          finalItinerary,
          budget || ""
        );
        console.log("    - Calling Google AI for final budget calculation...");
        const { text } = await generateText({
          model,
          system: systemPrompt,
          messages: [{ role: "user", content: "Continue." }],
        });
        console.log(
          "    - AI call successful. Parsing and returning budget summary JSON."
        );
        const parsedJson = parseJsonResponse(text);
        return NextResponse.json(parsedJson);
      }

      case "calculate_brief_budget": {
        console.log("  -> Executing step: calculate_brief_budget");
        if (!finalItinerary) { // Reusing finalItinerary to pass the draft
          return NextResponse.json(
            { error: "Step 'calculate_brief_budget' requires 'finalItinerary' (containing the draft plan)." },
            { status: 400 }
          );
        }
        const systemPrompt = buildCalculateBriefBudgetPrompt(finalItinerary, budget || "");
        console.log("    - Calling Google AI for brief budget calculation...");
        const { text } = await generateText({
          model,
          system: systemPrompt,
          messages: [{ role: "user", content: "Continue." }],
        });
        console.log("    - AI call successful. Parsing and returning brief budget summary JSON.");
        const parsedJson = parseJsonResponse(text);
        return NextResponse.json(parsedJson);
      }

      default: {
        const exhaustiveCheck: never = step;
        console.error(`  ❌ Error: Invalid step provided: ${exhaustiveCheck}`);
        return NextResponse.json(
          { error: `Invalid step: ${exhaustiveCheck}` },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("❌ /api/chat: Unhandled error in POST handler.", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
