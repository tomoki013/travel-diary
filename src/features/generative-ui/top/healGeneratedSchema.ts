import {
  ALLOWED_PRIMITIVE_TYPES,
  LayoutTypeSchema,
  type GeneratedTopPage,
  type LayoutType,
  type PrimitiveNode,
  type PrimitiveType,
} from "./schema";

/**
 * AIが生成した不安定なJSONを、バリデーションが通る形式に「修復」するユーティリティ。
 * 主に missing id や不正な type を補完します。
 */
type RawRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is RawRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim() ? value : fallback;

const asOptionalString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value : undefined;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const asLayoutType = (value: unknown): LayoutType => {
  const parsed = LayoutTypeSchema.safeParse(value);
  return parsed.success ? parsed.data : "mixed";
};

export function healGeneratedSchema(raw: unknown): GeneratedTopPage | unknown {
  if (!raw || typeof raw !== "object") return raw;

  const input = raw as RawRecord;

  // 1. トップレベルの必須フィールド
  const healed: GeneratedTopPage = {
    schemaVersion: "1.0",
    generationId: asString(input.generationId, `gen-${Math.random().toString(36).slice(2, 10)}`),
    pageTitle: asString(input.pageTitle, "旅行プランのご提案"),
    pageDescription: asString(input.pageDescription, ""),
    designReason: asString(input.designReason, "AIによる自動生成"),
    layoutType: asLayoutType(input.layoutType),
    sections: [],
    usedArticleIds: asStringArray(input.usedArticleIds),
    warnings: asStringArray(input.warnings),
  };

  // 2. sections の再帰的な修復
  if (Array.isArray(input.sections)) {
    healed.sections = input.sections
      .map((node, index) => healNode(node, `sec-${index}`))
      .filter((node): node is PrimitiveNode => node !== null);
  } else {
    healed.sections = [];
  }

  return healed;
}

function healNode(node: unknown, fallbackId: string): PrimitiveNode | null {
  if (!isRecord(node)) return null;

  // type が存在しない、または許可されていない場合は補完を試みるか除外
  let type = typeof node.type === "string" ? node.type : undefined;
  if (!type || !ALLOWED_PRIMITIVE_TYPES.includes(type as PrimitiveType)) {
    // children があれば container として扱う
    if (Array.isArray(node.children)) {
      type = "container";
    } else if (node.text) {
      type = "body_text";
    } else {
      return null; // 修復不能なノード
    }
  }
  const primitiveType = type as PrimitiveType;

  const healedNode: PrimitiveNode = {
    id: asString(
      node.id,
      `${primitiveType}-${fallbackId}-${Math.random().toString(36).slice(2, 6)}`,
    ),
    type: primitiveType,
    props: isRecord(node.props) ? node.props : {},
    reason: asOptionalString(node.reason),
  };

  // 子要素の再帰修復
  if (Array.isArray(node.children)) {
    healedNode.children = node.children
      .map((child, index) => healNode(child, `${healedNode.id}-c${index}`))
      .filter((child): child is PrimitiveNode => child !== null);

    if (healedNode.children.length === 0) {
      delete healedNode.children;
    }
  }

  return healedNode;
}
