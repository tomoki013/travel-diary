import { articleCategories, travelTopicOptions } from "./categories";

/**
 * 検索・絞り込み・並び替えの共通タクソノミーと「維持基準」。
 *
 * --- 維持基準（このファイルが source of truth）---
 *
 * 1. 並び替え（sort）= 表示順だけを変える。`recommended | new | old` の 3 つに固定。
 *    記事の取捨選択は行わない（取捨選択は絞り込み側の責務）。
 *
 * 2. 絞り込み（filter）= 表示する記事を絞る。次の 4 軸のみ：
 *    - カテゴリ  : `src/data/categories.ts` の `articleCategories` と 1:1。
 *                  `PostType` を増やしたときだけ追加する。
 *    - 実用ラベル: `travelTopicOptions` と 1:1。`TravelTopic` を増やしたときだけ追加する。
 *    - 記事タイプ(lens): すべて / 実用情報(practical) / 旅行記(diary)。
 *                  意味は `src/lib/post-discovery.ts` の述語定義に追従する。
 *    - タグ      : 下記 `FILTERABLE_TAGS` の厳選セットのみ。
 *
 * 3. タグの採用基準（FILTERABLE_TAGS）:
 *    - 「再利用できる普遍的な旅テーマ」であること（例: 初海外・グルメ・絶景）。
 *    - 実データで **3 記事以上** に付与されていること。
 *    - 一回限りの固有名詞（地名・建造物名・サービス名など）は採用しない。
 *      → 地名は地域フィルタ、固有名詞はキーワード検索で拾う。
 *    - 「海外旅行」のようにほぼ全記事に付くタグは絞り込みとして役に立たないため除外する。
 *    記事を追加・更新したときに上記を満たすタグが現れたら、ここに手動で追記する。
 *
 * 詳細は docs/search-filtering.md を参照。
 */

export type SortKey = "recommended" | "new" | "old";
export type LensKey = "all" | "practical" | "diary";

export interface FilterValue {
  /** PostType | "all" */
  category: string;
  /** TravelTopic | "all" */
  topic: string;
  lens: LensKey;
  tags: string[];
}

export const EMPTY_FILTER: FilterValue = {
  category: "all",
  topic: "all",
  lens: "all",
  tags: [],
};

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "おすすめ" },
  { value: "new", label: "新しい順" },
  { value: "old", label: "古い順" },
];

export const lensOptions: { value: LensKey; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "practical", label: "実用情報" },
  { value: "diary", label: "旅行記" },
];

/**
 * 絞り込みに出すカテゴリ・実用ラベル（"all" を除いた選択肢）。
 * categories.ts と 1:1 を保つ。
 */
export const filterableCategories = articleCategories.filter((option) => option.slug !== "all");
export const filterableTopics = travelTopicOptions.filter((option) => option.slug !== "all");

/**
 * 絞り込みに表示する厳選タグ（上記「タグの採用基準」を満たす実在タグのみ）。
 * 旅行者にとって入口になりやすい順に並べている。
 */
export const FILTERABLE_TAGS: string[] = [
  "初海外",
  "空港アクセス",
  "交通情報",
  "トラブル",
  "グルメ",
  "観光スポット",
  "絶景",
  "街歩き",
  "一人旅",
  "歴史",
  "夕陽",
  "国内旅行",
];

export const isSortKey = (value: string): value is SortKey =>
  value === "recommended" || value === "new" || value === "old";

export const isLensKey = (value: string): value is LensKey =>
  value === "all" || value === "practical" || value === "diary";

/** 現在アクティブな絞り込みの数（バッジ表示用）。並び替え・地域は含めない。 */
export const countActiveFilters = (value: FilterValue): number => {
  let count = 0;
  if (value.category !== "all") count += 1;
  if (value.topic !== "all") count += 1;
  if (value.lens !== "all") count += 1;
  count += value.tags.length;
  return count;
};

/** topic を選んだら tourism に寄せる（既存の正規化ルールを踏襲）。 */
export const normalizeFilterValue = (value: FilterValue): FilterValue => {
  if (value.topic !== "all") {
    return { ...value, category: "tourism" };
  }
  return value;
};
