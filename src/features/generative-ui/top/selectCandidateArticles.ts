import type { SafeArticleContext } from "./schema";

const MAX_CANDIDATES = 20;

type ArticleEntry = SafeArticleContext & {
  category?: string;
  dates?: string[];
};

export function selectCandidateArticles(
  articles: ArticleEntry[],
  userInput: string,
): SafeArticleContext[] {
  const input = userInput.toLowerCase();
  const tokens = tokenize(input);

  const scored = articles.map((article) => {
    const score = scoreArticle(article, tokens, input);
    return { article, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, MAX_CANDIDATES);

  // If there are fewer than 5 results with a meaningful score, pad with recent articles
  const meaningful = top.filter((x) => x.score > 0);
  if (meaningful.length < 5) {
    const byDate = [...articles]
      .sort((a, b) => {
        const da = a.dates?.[0] ?? "";
        const db = b.dates?.[0] ?? "";
        return db.localeCompare(da);
      })
      .slice(0, MAX_CANDIDATES);

    const merged = mergeUnique(
      meaningful.map((x) => x.article),
      byDate,
    );
    return merged.slice(0, MAX_CANDIDATES).map(toSafe);
  }

  return top.map((x) => x.article).map(toSafe);
}

function toSafe(a: ArticleEntry): SafeArticleContext {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    summaryForAI: a.summaryForAI,
    themes: a.themes,
    tags: a.tags,
    area: a.area,
    country: a.country,
    city: a.city,
    heroImageId: a.heroImageId,
  };
}

function mergeUnique(primary: ArticleEntry[], secondary: ArticleEntry[]): ArticleEntry[] {
  const ids = new Set(primary.map((a) => a.id));
  const extras = secondary.filter((a) => !ids.has(a.id));
  return [...primary, ...extras];
}

function tokenize(text: string): string[] {
  return text
    .replace(/[、。！？「」『』【】・\-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function scoreArticle(article: ArticleEntry, tokens: string[], rawInput: string): number {
  let score = 0;

  const searchText = [
    article.title,
    article.summaryForAI,
    ...(article.tags ?? []),
    ...(article.themes ?? []),
    article.area ?? "",
    article.country ?? "",
    article.city ?? "",
  ]
    .join(" ")
    .toLowerCase();

  for (const token of tokens) {
    if (searchText.includes(token)) score += 2;
  }

  // Country/area bonus
  if (article.country && rawInput.includes(article.country)) score += 5;
  if (article.area && rawInput.includes(article.area)) score += 5;
  if (article.city && rawInput.includes(article.city)) score += 4;

  // Keyword bonuses
  const anxietyWords = ["不安", "心配", "初めて", "初海外", "初心者"];
  const photoWords = ["写真", "絶景", "撮り", "カメラ"];
  const constraintWords = ["車なし", "日帰り", "節約", "安い", "格安", "徒歩"];
  const comparisonWords = ["迷っ", "比較", "どっち", "違い"];

  if (anxietyWords.some((w) => rawInput.includes(w))) {
    if (
      searchText.includes("不安") ||
      searchText.includes("注意") ||
      searchText.includes("初心者")
    ) {
      score += 3;
    }
  }
  if (photoWords.some((w) => rawInput.includes(w))) {
    if (
      searchText.includes("写真") ||
      searchText.includes("絶景") ||
      article.themes?.includes("絶景")
    ) {
      score += 3;
    }
  }
  if (constraintWords.some((w) => rawInput.includes(w))) {
    if (
      searchText.includes("節約") ||
      searchText.includes("アクセス") ||
      searchText.includes("交通")
    ) {
      score += 3;
    }
  }
  if (comparisonWords.some((w) => rawInput.includes(w))) {
    if (searchText.includes("比較") || searchText.includes("選び方")) {
      score += 3;
    }
  }

  return score;
}
