import type { GeneratedTopPage } from "./schema";

export function buildFallbackSchema(reason?: string): GeneratedTopPage {
  return {
    schemaVersion: "1.0",
    generationId: `fallback-${Date.now()}`,
    pageTitle: "旅行トップを生成できませんでした",
    pageDescription:
      reason || "安全に表示できるUIを作れなかったため、再生成してください。",
    designReason: "生成に失敗したため、フォールバック表示を使用しています。",
    layoutType: "mixed",
    sections: [
      {
        id: "fallback-callout",
        type: "callout",
        props: {
          variant: "warning",
          title: "生成できませんでした",
          text: reason || "入力を少し具体的にするか、もう一度試してください。",
        },
      },
      {
        id: "fallback-heading",
        type: "heading",
        props: { text: "入力のヒント", level: 2 },
      },
      {
        id: "fallback-tips",
        type: "stack",
        props: {},
        children: [
          {
            id: "tip-1",
            type: "text",
            props: { text: "・行き先（国・都市名）を入れると精度が上がります" },
          },
          {
            id: "tip-2",
            type: "text",
            props: { text: "・「不安なこと」や「したいこと」を書くと最適化されます" },
          },
          {
            id: "tip-3",
            type: "text",
            props: { text: "・「車なし」「一人旅」などの制約を加えると絞り込みやすくなります" },
          },
        ],
      },
    ],
    usedArticleIds: [],
    warnings: [],
  };
}
