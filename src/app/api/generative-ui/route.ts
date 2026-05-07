import { google } from "@ai-sdk/google";
import { streamText, tool, convertToModelMessages, UIMessage } from "ai";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const postsCachePath = path.join(process.cwd(), ".posts.cache.json");
let postsCache: Record<string, string> | null = null;

async function loadCache() {
  if (postsCache) return postsCache;
  try {
    const data = await fs.readFile(postsCachePath, "utf8");
    postsCache = JSON.parse(data) as Record<string, string>;
    return postsCache;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const { messages: uiMessages }: { messages: UIMessage[] } = await req.json();
  const messages = convertToModelMessages(uiMessages);
  const cache = await loadCache();

  const lastUserMessage = [...uiMessages].reverse().find(m => m.role === 'user')
    ?.parts.find(p => p.type === 'text')?.text || "";
  
  let relevantArticles: { title: string; slug: string; summary: string }[] = [];
  
  if (cache && lastUserMessage) {
    const commonKeywords = ["アテネ", "サントリーニ", "ギリシャ", "空港", "予算", "写真", "バンコク", "タイ", "インド", "エジプト", "フランス", "スペイン", "マレーシア", "シンガポール", "インドネシア", "ベトナム", "トルコ", "持ち物", "パッキング", "移動", "バス", "鉄道", "地下鉄", "ホテル", "グルメ", "レストラン"];
    const extractedKeywords = commonKeywords.filter(k => lastUserMessage.includes(k));
    
    if (extractedKeywords.length > 0) {
      const scoredArticles = Object.entries(cache)
        .map(([slug, content]) => {
          let score = 0;
          extractedKeywords.forEach(k => {
            if (slug.includes(k.toLowerCase())) score += 10;
            const regex = new RegExp(k, 'g');
            const matches = content.match(regex);
            if (matches) score += matches.length;
          });
          return { slug, content, score };
        })
        .filter(a => a.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

      relevantArticles = scoredArticles.map(({ slug, content }) => {
        const titleMatch = content.match(/^Title: (.*)/m);
        const title = titleMatch ? titleMatch[1] : slug;
        const summary = content.split('\n').slice(1, 4).join(' ').replace(/[#*`]/g, "").substring(0, 120) + "...";
        return { title, slug, summary };
      });
    }
  }

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
    system: `あなたは世界中を旅した経験を持つベテランの旅行プランナーであり、ユーザーの要望に合わせて最適な「パーソナライズされた旅行管理アプリ」をその場で構築するAIエンジニアです。

### ミッション
ユーザーの曖昧な悩みや要望に対し、単なるテキスト回答ではなく、複数の専用UIコンポーネント（ツール）を組み合わせて、一つの完結した「解決用ダッシュボード」を提示してください。

### ツール活用のガイドライン
1. **比較が必要な時**: 'compareDestinations' を使い、項目ごとに数値化して比較してください。
2. **移動の不安がある時**: 'showAirportAnxiety' で具体的な交通手段と難易度（不安度）を示してください。
3. **具体的な日程を知りたい時**: 'showItinerary' で分単位、または時間帯別のスケジュールを提示してください。
4. **お金の心配がある時**: 'simulateBudget' で「バックパッカー」「標準」「ラグジュアリー」などの階層別満足度をシミュレートしてください。
5. **映える場所を知りたい時**: 'showPhotoSpots' で撮影に最適な時間帯やテーマを提案してください。
6. **準備を始めたい時**: 'showPackingList' でその土地、季節に特化した持ち物リストを作成してください。
7. **詳細な記録を読ませたい時**: 提供された「関連記事」がある場合、必ず 'embedArticles' を使ってユーザーをブログ記事へ誘導してください。

### 回答の構成
- 冒頭でユーザーの要望に対する共感と、これから提示するダッシュボードの概要を1-2行で述べます。
- 適切な順序でツールを呼び出します（例：比較 → 移動 → 日程 → 予算）。
- ツールの間には、なぜそのツールを提示したのか、どんな発見があるのかを簡潔に補足します。
- 最後に、旅行を成功させるためのワンポイントアドバイスを添えて締めくくります。

### 注意事項
- ツール呼び出しは一つに絞らず、2〜4個程度を組み合わせて「アプリ感」を出してください。
- データの精度にこだわり、具体的（金額、所要時間、地名）な内容にしてください。
- 関連記事情報は以下の通りです。これらに基づいて 'embedArticles' を構成してください。

### 関連記事データ
${relevantArticles.length > 0 ? JSON.stringify(relevantArticles, null, 2) : "関連する特定のブログ記事は見当たりません。一般的な知識に基づいて回答してください。"}`,
    tools: {
      compareDestinations: tool({
        description: "Compare two travel destinations side-by-side with ratings.",
        inputSchema: z.object({
          destinationA: z.string(),
          destinationB: z.string(),
          categories: z.array(z.object({
            name: z.string(),
            ratingA: z.number().min(1).max(5),
            ratingB: z.number().min(1).max(5),
            comment: z.string()
          })),
          verdict: z.string()
        }),
      }),
      showAirportAnxiety: tool({
        description: "Show airport transfer options and difficulty level.",
        inputSchema: z.object({
          airportName: z.string(),
          destinationName: z.string(),
          options: z.array(z.object({
            mode: z.string(),
            time: z.string(),
            cost: z.string(),
            difficulty: z.enum(["Easy", "Medium", "Hard"]),
            description: z.string()
          })),
          overallAnxietyLevel: z.number().min(1).max(100)
        }),
      }),
      showItinerary: tool({
        description: "Show a sample daily itinerary for the trip.",
        inputSchema: z.object({
          title: z.string(),
          destination: z.string(),
          duration: z.string(),
          days: z.array(z.object({
            day: z.number(),
            title: z.string(),
            schedule: z.array(z.object({
              time: z.string(),
              activity: z.string(),
              description: z.string(),
              location: z.string().optional()
            }))
          }))
        }),
      }),
      simulateBudget: tool({
        description: "Simulate travel satisfaction based on budget.",
        inputSchema: z.object({
          destination: z.string(),
          currency: z.string(),
          tiers: z.array(z.object({
            label: z.string(),
            dailyCost: z.number(),
            satisfaction: z.number().min(1).max(100),
            description: z.string()
          }))
        }),
      }),
      showPhotoSpots: tool({
        description: "Show iconic photo spots for a destination.",
        inputSchema: z.object({
          destination: z.string(),
          spots: z.array(z.object({
            name: z.string(),
            theme: z.string(),
            bestTime: z.string(),
            instagrammability: z.number().min(1).max(5)
          }))
        }),
      }),
      showPackingList: tool({
        description: "Provide a destination and season specific packing list.",
        inputSchema: z.object({
          destination: z.string(),
          season: z.string(),
          items: z.array(z.object({
            item: z.string(),
            category: z.string().describe("e.g. Clothing, Tech, Documents"),
            reason: z.string(),
            essential: z.boolean()
          }))
        }),
      }),
      embedArticles: tool({
        description: "Embed relevant blog articles.",
        inputSchema: z.object({
          articles: z.array(z.object({
            title: z.string(),
            slug: z.string(),
            summary: z.string(),
            category: z.string().optional()
          }))
        }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
