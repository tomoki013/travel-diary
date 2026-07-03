// スナップショットから「次にやるべきこと」を自動抽出する分析ロジック。
// UI から独立した純関数群。しきい値は少データのブログ向けに緩めに調整してある。

import type {
  AnalyticsSnapshot,
  AnalyticsPostInfo,
  GscQueryRow,
  GscPageRow,
} from "@/types/analytics";

/**
 * 掲載順位ごとの期待CTR (検索結果での一般的なクリック率カーブの概算)。
 * 「この順位ならこれくらいクリックされるはず」の基準として使う。
 */
export function expectedCtr(position: number): number {
  const table = [0.28, 0.15, 0.1, 0.07, 0.055, 0.045, 0.035, 0.03, 0.025, 0.022];
  if (position <= 10) {
    const idx = Math.max(0, Math.min(9, Math.round(position) - 1));
    return table[idx];
  }
  if (position <= 20) return 0.015 - ((position - 11) / 9) * 0.007; // 1.5% → 0.8%
  return 0.005;
}

/** タイトル/説明の改善候補: 順位は取れているのに期待よりクリックされていないクエリ */
export interface CtrGapItem {
  query: string;
  path: string;
  impressions28: number;
  clicks28: number;
  position28: number;
  actualCtr: number;
  expectedCtr: number;
  /** 期待通りクリックされていれば増えていたはずの28日クリック数 */
  missedClicks: number;
}

export function findCtrGaps(queries: GscQueryRow[]): CtrGapItem[] {
  return queries
    .flatMap((row) => {
      if (row.position28 == null || row.position28 > 12 || row.impressions28 < 20) return [];
      const actual = row.clicks28 / row.impressions28;
      const expected = expectedCtr(row.position28);
      if (actual >= expected * 0.6) return []; // 期待の6割取れていれば問題なし
      return [
        {
          query: row.query,
          path: row.path,
          impressions28: row.impressions28,
          clicks28: row.clicks28,
          position28: row.position28,
          actualCtr: actual,
          expectedCtr: expected,
          missedClicks: Math.round(row.impressions28 * (expected - actual)),
        },
      ];
    })
    .sort((a, b) => b.missedClicks - a.missedClicks);
}

/** リライト候補: 順位4〜20位のクエリを記事単位に束ね、1ページ目上位に上がった場合の増分クリックでスコア化 */
export interface RewriteCandidate {
  path: string;
  /** 対象クエリ (表示回数順、上位のみ) */
  queries: { query: string; impressions28: number; position28: number }[];
  impressions28: number;
  /** 3位相当まで上がった場合に見込める28日クリックの増分 */
  potentialClicks: number;
}

export function findRewriteCandidates(queries: GscQueryRow[]): RewriteCandidate[] {
  const byPath = new Map<string, RewriteCandidate>();
  for (const row of queries) {
    if (row.position28 == null || row.position28 < 4 || row.position28 > 20) continue;
    if (row.impressions28 < 5) continue;
    const actual = row.clicks28 / Math.max(1, row.impressions28);
    const potential = Math.max(0, row.impressions28 * (expectedCtr(3) - actual));
    const entry = byPath.get(row.path) ?? {
      path: row.path,
      queries: [],
      impressions28: 0,
      potentialClicks: 0,
    };
    entry.queries.push({
      query: row.query,
      impressions28: row.impressions28,
      position28: row.position28,
    });
    entry.impressions28 += row.impressions28;
    entry.potentialClicks += potential;
    byPath.set(row.path, entry);
  }
  return [...byPath.values()]
    .map((c) => ({
      ...c,
      potentialClicks: Math.round(c.potentialClicks),
      queries: c.queries.sort((a, b) => b.impressions28 - a.impressions28).slice(0, 3),
    }))
    .sort((a, b) => b.potentialClicks - a.potentialClicks);
}

/** インデックス問題の疑い: 実用カテゴリなのに全期間で表示0の記事 */
export function findIndexSuspects(
  pages: GscPageRow[],
  postInfo: Record<string, AnalyticsPostInfo>,
): { path: string; category: string }[] {
  const impressionsByPath = new Map(pages.map((p) => [p.path, p.impressions]));
  return Object.entries(postInfo)
    .filter(
      ([path, info]) =>
        !info.noindex && info.category !== "series" && (impressionsByPath.get(path) ?? 0) === 0,
    )
    .map(([path, info]) => ({ path, category: info.category }));
}

/** 週次推移から傾向を判定: 直近2週 vs その前2週 (完結した週のみ使う) */
export type Momentum = "rising" | "falling" | "flat" | "none";

export interface MomentumResult {
  momentum: Momentum;
  /** 直近2週の表示回数合計 */
  recent: number;
  /** その前2週の表示回数合計 */
  prior: number;
  changeRatio: number | null;
}

export function computeMomentum(
  weeks: string[],
  weeklyImpressions: number[],
  rangeEnd: string | null,
): MomentumResult {
  // データ最終日を含む週は集計途中なので除外する
  const completeIdx = weeks
    .map((week, i) => ({ week, i }))
    .filter(({ week }) => rangeEnd != null && addDays(week, 6) <= rangeEnd)
    .map(({ i }) => i);
  const values = completeIdx.map((i) => weeklyImpressions[i] ?? 0);
  if (values.length < 4) return { momentum: "none", recent: 0, prior: 0, changeRatio: null };

  const recent = values.slice(-2).reduce((a, b) => a + b, 0);
  const prior = values.slice(-4, -2).reduce((a, b) => a + b, 0);
  if (recent === 0 && prior === 0) {
    return { momentum: "none", recent, prior, changeRatio: null };
  }
  const ratio = prior > 0 ? (recent - prior) / prior : 1;
  const momentum: Momentum =
    ratio >= 0.3 && recent - prior >= 5 ? "rising" : ratio <= -0.3 ? "falling" : "flat";
  return { momentum, recent, prior, changeRatio: prior > 0 ? ratio : null };
}

/** ダッシュボード全体のインサイトをまとめて計算する */
export function buildInsights(
  snapshot: AnalyticsSnapshot,
  postInfo: Record<string, AnalyticsPostInfo>,
) {
  const ctrGaps = findCtrGaps(snapshot.gsc.queries).slice(0, 10);
  const rewrites = findRewriteCandidates(snapshot.gsc.queries).slice(0, 10);
  const indexSuspects = findIndexSuspects(snapshot.gsc.pages, postInfo);

  // ページ別モメンタム
  const weeks = [...new Set(snapshot.gsc.pagesWeekly.map((r) => r.week))].sort();
  const weeklyByPath = new Map<string, number[]>();
  for (const r of snapshot.gsc.pagesWeekly) {
    if (!weeklyByPath.has(r.path)) weeklyByPath.set(r.path, new Array(weeks.length).fill(0));
    weeklyByPath.get(r.path)![weeks.indexOf(r.week)] = r.impressions;
  }
  const momentumByPath = new Map<string, MomentumResult>();
  for (const [path, values] of weeklyByPath) {
    momentumByPath.set(path, computeMomentum(weeks, values, snapshot.gsc.range.end));
  }
  const rising = [...momentumByPath.entries()]
    .filter(([, m]) => m.momentum === "rising")
    .sort(([, a], [, b]) => b.recent - a.recent);
  const falling = [...momentumByPath.entries()]
    .filter(([, m]) => m.momentum === "falling")
    .sort(([, a], [, b]) => b.prior - a.prior);

  return { ctrGaps, rewrites, indexSuspects, rising, falling, momentumByPath };
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
