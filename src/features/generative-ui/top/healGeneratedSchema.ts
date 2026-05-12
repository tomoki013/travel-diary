import { ALLOWED_PRIMITIVE_TYPES, type PrimitiveType } from "./schema";

/**
 * AIが生成した不安定なJSONを、バリデーションが通る形式に「修復」するユーティリティ。
 * 主に missing id や不正な type を補完します。
 */
export function healGeneratedSchema(raw: any): any {
  if (!raw || typeof raw !== "object") return raw;

  const healed = { ...raw };

  // 1. トップレベルの必須フィールド
  healed.pageTitle = healed.pageTitle || "旅行プランのご提案";
  healed.pageDescription = healed.pageDescription || "";
  healed.designReason = healed.designReason || "AIによる自動生成";
  healed.layoutType = healed.layoutType || "mixed";
  healed.usedArticleIds = Array.isArray(healed.usedArticleIds) ? healed.usedArticleIds : [];
  healed.warnings = Array.isArray(healed.warnings) ? healed.warnings : [];
  healed.schemaVersion = "1.0";
  healed.generationId = healed.generationId || `gen-${Math.random().toString(36).slice(2, 10)}`;

  // 2. sections の再帰的な修復
  if (Array.isArray(healed.sections)) {
    healed.sections = healed.sections
      .map((node: any, index: number) => healNode(node, `sec-${index}`))
      .filter((n: any) => n !== null);
  } else {
    healed.sections = [];
  }

  return healed;
}

function healNode(node: any, fallbackId: string): any {
  if (!node || typeof node !== "object") return null;

  // type が存在しない、または許可されていない場合は補完を試みるか除外
  let type = node.type;
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

  const healedNode: any = {
    id: node.id || `${type}-${fallbackId}-${Math.random().toString(36).slice(2, 6)}`,
    type: type,
    props: node.props && typeof node.props === "object" ? node.props : {},
    reason: node.reason || undefined,
  };

  // 子要素の再帰修復
  if (Array.isArray(node.children)) {
    healedNode.children = node.children
      .map((child: any, index: number) => healNode(child, `${healedNode.id}-c${index}`))
      .filter((c: any) => c !== null);
    
    if (healedNode.children.length === 0) {
      delete healedNode.children;
    }
  }

  return healedNode;
}
