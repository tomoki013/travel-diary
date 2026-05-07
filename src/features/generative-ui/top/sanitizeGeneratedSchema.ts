import type { GeneratedTopPage, PrimitiveNode } from "./schema";
import { ALLOWED_PRIMITIVE_TYPES } from "./schema";

const DANGEROUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /data:(?!image\/)/i,
  /onerror\s*=/i,
  /onclick\s*=/i,
  /\bfetch\s*\(/i,
  /\beval\s*\(/i,
  /document\.cookie/i,
  /localStorage/i,
  /sessionStorage/i,
  /window\./i,
  /<iframe/i,
  /on\w+\s*=/i,
];

function isDangerous(value: unknown): boolean {
  if (typeof value === "string") {
    return DANGEROUS_PATTERNS.some((p) => p.test(value));
  }
  if (typeof value === "object" && value !== null) {
    return Object.values(value).some(isDangerous);
  }
  if (Array.isArray(value)) {
    return (value as unknown[]).some(isDangerous);
  }
  return false;
}

function sanitizeString(value: string): string {
  return value
    .replace(/<[^>]*>/g, "") // strip any HTML tags
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .trim();
}

function sanitizeProps(props: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (isDangerous(value)) continue;
    if (typeof value === "string") {
      result[key] = sanitizeString(value);
    } else if (typeof value === "number" || typeof value === "boolean") {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = (value as unknown[])
        .filter((v) => !isDangerous(v))
        .map((v) => (typeof v === "string" ? sanitizeString(v) : v));
    } else if (typeof value === "object" && value !== null) {
      const nested = sanitizeProps(value as Record<string, unknown>);
      if (Object.keys(nested).length > 0) result[key] = nested;
    }
  }
  return result;
}

function sanitizeNode(node: PrimitiveNode, validArticleIds: Set<string>): PrimitiveNode | null {
  // Drop unknown primitive types
  if (!ALLOWED_PRIMITIVE_TYPES.includes(node.type)) return null;

  // Drop dangerous nodes
  if (isDangerous(node.id) || isDangerous(node.props)) return null;

  const props = sanitizeProps(node.props);

  // Validate articleId references
  if (node.type === "article_card") {
    const articleId = props.articleId as string | undefined;
    if (!articleId || !validArticleIds.has(articleId)) return null;
  }

  if (node.type === "article_list") {
    const ids = props.articleIds as string[] | undefined;
    if (!Array.isArray(ids)) return null;
    props.articleIds = ids.filter((id) => validArticleIds.has(id));
    if ((props.articleIds as string[]).length === 0) return null;
  }

  if (node.type === "next_action") {
    const articleId = props.articleId as string | undefined;
    if (articleId && !validArticleIds.has(articleId)) {
      delete props.articleId;
    }
  }

  if (node.type === "timeline") {
    const items = props.items as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(items)) {
      props.items = items.map((item) => {
        const sanitized = sanitizeProps(item);
        if (sanitized.articleId && !validArticleIds.has(sanitized.articleId as string)) {
          delete sanitized.articleId;
        }
        return sanitized;
      });
    }
  }

  // Remove any URL fields AI might have added
  delete props.href;
  delete props.src;
  delete props.url;
  delete props.link;

  const children = node.children
    ?.map((child) => sanitizeNode(child, validArticleIds))
    .filter((n): n is PrimitiveNode => n !== null);

  return {
    id: sanitizeString(node.id),
    type: node.type,
    props,
    children: children && children.length > 0 ? children : undefined,
  };
}

export function sanitizeGeneratedSchema(
  schema: GeneratedTopPage,
  validArticleIds: Set<string>
): GeneratedTopPage {
  const sanitizedSections = schema.sections
    .map((node) => sanitizeNode(node, validArticleIds))
    .filter((n): n is PrimitiveNode => n !== null);

  const sanitizedUsedArticleIds = schema.usedArticleIds.filter((id) =>
    validArticleIds.has(id)
  );

  return {
    ...schema,
    pageTitle: sanitizeString(schema.pageTitle).slice(0, 80),
    pageDescription: sanitizeString(schema.pageDescription).slice(0, 180),
    designReason: sanitizeString(schema.designReason).slice(0, 240),
    sections: sanitizedSections.length > 0 ? sanitizedSections : schema.sections,
    usedArticleIds: sanitizedUsedArticleIds,
    warnings: schema.warnings.map((w) => sanitizeString(w).slice(0, 160)),
  };
}
