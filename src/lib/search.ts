import { Post } from "@/types/types";

type PostMetadata = Omit<Post, "content">;

/**
 * 検索クエリを解析して、フレーズ、除外単語、ORグループに分割します。
 * @param query - ユーザーが入力した検索クエリ文字列。
 * @returns 解析されたクエリコンポーネントを含むオブジェクト。
 */
const parseQuery = (query: string) => {
  let remainingQuery = query;

  // フレーズ (例: "exact match")
  const phrases = (remainingQuery.match(/"[^"]+"/g) || []).map((p) =>
    p.slice(1, -1),
  );
  remainingQuery = remainingQuery.replace(/"[^"]+"/g, "").trim();

  // 除外単語 (例: -exclude)
  const notTerms =
    (remainingQuery.match(/-\S+/g) || []).map((t) => t.slice(1)) || [];
  remainingQuery = remainingQuery.replace(/-\S+/g, "").trim();

  // OR グループ (AND条件で結合された単語のグループ)
  const orGroups = remainingQuery
    .split(/\s+OR\s+/i)
    .map((group) => group.trim().split(/\s+/).filter(Boolean))
    .filter((group) => group.length > 0);

  const allTerms = orGroups.flat();

  return { phrases, notTerms, orGroups, allTerms };
};

// Helper to escape regex special characters
const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// 検索ロジックを定義
export const filterPostsBySearch = (
  posts: PostMetadata[],
  query: string,
): PostMetadata[] => {
  if (!query) {
    return posts;
  }

  const { phrases, notTerms, orGroups } = parseQuery(query);

  return posts.filter((post) => {
    const searchableFields = [
      post.title,
      post.excerpt,
      post.category,
      post.location,
      post.author,
      post.series,
      post.tags,
      post.travelTopics,
    ]
      .flat()
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.toLowerCase());

    const checkMatch = (term: string) => {
      const lowerTerm = term.toLowerCase();
      if (lowerTerm.includes("*")) {
        const regex = new RegExp(
          escapeRegExp(lowerTerm).replace(/\\\*/g, ".*"),
          "i",
        );
        return searchableFields.some((field) => regex.test(field));
      }
      return searchableFields.some((field) => field.includes(lowerTerm));
    };

    // Filter logic
    if (notTerms.some(checkMatch)) {
      return false;
    }
    if (!phrases.every(checkMatch)) {
      return false;
    }
    if (orGroups.length > 0) {
      const match = orGroups.some((andTerms) => andTerms.every(checkMatch));
      if (!match) {
        return false;
      }
    }

    return true;
  });
};

// スコアリングロジックを定義
export const calculateScores = (
  posts: PostMetadata[],
  query: string,
  weights?: Partial<Record<keyof PostMetadata, number>>,
  searchableKeys?: (keyof PostMetadata)[],
): { post: PostMetadata; score: number }[] => {
  if (!query) {
    return posts.map((post) => ({ post, score: 0 }));
  }

  // スコアリングでは、クエリ全体を小文字に変換して処理する
  const { phrases, allTerms } = parseQuery(query.toLowerCase());

  const finalWeights = {
    title: 10,
    excerpt: 5,
    category: 3,
    location: 3,
    author: 3,
    series: 3,
    tags: 3,
    travelTopics: 6,
    ...weights,
  };

  const finalSearchableKeys = searchableKeys || [
    "title",
    "excerpt",
    "category",
    "location",
    "author",
    "series",
    "tags",
    "travelTopics",
  ];

  const calculateTermFrequency = (text: string, term: string): number => {
    if (!text || !term) return 0;
    const escapedTerm = escapeRegExp(term);
    const regex = new RegExp(escapedTerm, "g");
    return (text.match(regex) || []).length;
  };

  return posts.map((post) => {
    let score = 0;

    const searchableFields: Record<string, string> = {};
    finalSearchableKeys.forEach((key) => {
      const value = post[key];
      if (Array.isArray(value)) {
        searchableFields[key as string] = value.join(" ").toLowerCase();
      } else if (typeof value === "string") {
        searchableFields[key as string] = value.toLowerCase();
      }
    });

    const processTerms = (terms: string[], multiplier = 1) => {
      terms.forEach((term) => {
        for (const key of finalSearchableKeys) {
          const weight = finalWeights[key as keyof typeof finalWeights] || 0;
          const fieldValue = searchableFields[key as string];
          if (fieldValue) {
            const tf = calculateTermFrequency(fieldValue, term);
            score += tf * weight * multiplier;
          }
        }
      });
    };

    processTerms(allTerms);
    processTerms(phrases, 2);

    return { post, score };
  });
};
