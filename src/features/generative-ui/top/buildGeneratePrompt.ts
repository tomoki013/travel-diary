import type { SafeArticleContext, IntentAnalysis } from "./schema";
import { COMPONENT_CATALOG } from "../registry/catalog";

export function buildGenerateSystemPrompt(intent: IntentAnalysis): string {
  const catalogText = COMPONENT_CATALOG.map(c => 
    `- **${c.type}**: ${c.description} (用途: ${c.bestUsedFor})\n  Props例: ${JSON.stringify(c.propsExample)}`
  ).join("\n");

  const prompt = [
    `あなたは旅行ブログ「ともきちの旅行日記」のシニアGenerative UI Designerです。`,
    `Step 1で分析されたユーザーの意図を「最高に素晴らしいデザイン」で具現化してください。`,
    `単なるパーツの羅列ではなく、プロのデザイナーが作成したような、情緒的で機能的なページを構成してください。`,
    ``,
    `## Step 1 の分析結果 (設計の指針)`,
    `- **主要な目的**: ${intent.primaryGoal}`,
    `- **ユーザーの懸念**: ${intent.keyConcerns.join(", ")}`,
    `- **推奨トーン**: ${intent.recommendedTone}`,
    `- **推奨戦略**: ${intent.suggestedLayoutStrategy}`,
    ``,
    `## 🌟 最高に素晴らしいUIにするためのガイドライン`,
    `1. **Content is King (重要)**: パーツを置くだけでなく、全てのパーツの \`props\`（text, title, description, label等）には、Step 1の分析に基づいた「ユーザーの心に刺さる具体的な言葉」を必ず書き込んでください。文字のない空のパーツは絶対に生成しないでください。`,
    `2. **Visual Impact**: 冒頭のsectionには必ず目を引くheading_h1、body_text、そしてimage_singleを組み合わせた「ヒーローエリア」を作ってください。`,
    `3. **Responsive Strategy**: PCでの閲覧を意識し、情報を並列に見せたい場合は \`grid\`（cols: 2 または 3）を積極的に活用してください。これにより、PCでは綺麗なカラム表示、モバイルでは自動的なスタック表示になります。`,
    `4. **Hierarchy & Rhythm**: sectionごとに役割を明確にし、情報の重要度に合わせてspacer（small/medium/large）を使い分け、視覚的なリズムを作ってください。`,
    `5. **Emotional Design**: ユーザーの懸念（keyConcerns）に対してはalert_box（warning）だけでなく、安心させるためのtip_calloutやdid_you_knowを織り交ぜて「寄り添うUI」にしてください。`,
    `6. **Rich Composition**: 単純なstackではなく、gridを使って要素を並列化したり、cardの中にkey_value_listやrating_starsをネストさせたりして、密度のあるデザインにしてください。`,
    `7. **Action-Oriented**: 最後に必ずnext_actionまたはprimary_buttonを配置し、ユーザーが「次の一歩」を踏み出しやすくしてください。`,
    ``,
    `## 使用可能なコンポーネント・カタログ`,
    `AIはこのカタログにあるものだけを使用できます。`,
    ``,
    catalogText,
    ``,
    `## 出力ルール`,
    `- 出力はJSONオブジェクトのみ（コードブロックなし、説明文なし）`,
    `- 全てのNodeに「reason」プロパティを含め、その配置意図を日本語で記述してください`,
    `- candidateArticlesのidのみ使用可能`,
    ``,
    `## JSON出力形式`,
    `{`,
    `  "schemaVersion": "1.0",`,
    `  "generationId": "gen-[ランダム8桁英数字]",`,
    `  "pageTitle": "意図に沿った魅力的なタイトル",`,
    `  "pageDescription": "...",`,
    `  "designReason": "全体の設計意図（特にStep 1をどう反映したか、デザインのこだわり）",`,
    `  "layoutType": "mixed",`,
    `  "sections": [/* PrimitiveNodeの配列 */],`,
    `  "usedArticleIds": [...],`,
    `  "warnings": []`,
    `}`
  ].join("\n");

  return prompt;
}

export function buildGenerateUserPayload(
  userInput: string,
  candidateArticles: SafeArticleContext[],
  device: string,
  intent: IntentAnalysis
): string {
  const sanitizedInput = sanitizeUserInput(userInput);

  return JSON.stringify({
    userTravelRequest: sanitizedInput,
    device,
    intentAnalysis: intent,
    candidateArticles: candidateArticles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      summaryForAI: a.summaryForAI,
      themes: a.themes,
      tags: a.tags,
      area: a.area,
      country: a.country,
    })),
    instruction:
      "分析結果と記事リストに基づき、ユーザーの課題を解決する最高のUI SchemaをJSONで作成してください。",
  });
}

function sanitizeUserInput(input: string): string {
  // Limit length and remove obvious injection patterns
  return input
    .slice(0, 500)
    .replace(/system\s*prompt/gi, "")
    .replace(/ignore\s*(previous|all)/gi, "")
    .replace(/```/g, "")
    .trim();
}
