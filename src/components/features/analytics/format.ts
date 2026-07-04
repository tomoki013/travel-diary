// /admin/analytics 共通の数値フォーマッタと集計ヘルパー

export function fmtInt(n: number): string {
  return n.toLocaleString("ja-JP");
}

/** CTR など 0〜1 の比率を % 表記にする。分母0は "-" */
export function fmtCtr(clicks: number, impressions: number): string {
  if (impressions <= 0) return "-";
  return `${((clicks / impressions) * 100).toFixed(1)}%`;
}

/** 0〜1 の比率を % 表記にする */
export function fmtPct(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}

export function fmtPosition(position: number | null | undefined): string {
  return position == null ? "-" : position.toFixed(1);
}

/** 前期間との増減を「+12」「-3」形式で返す。前期間0で今期間も0なら null */
export function fmtDelta(current: number, previous: number): string | null {
  const diff = current - previous;
  if (diff === 0) return null;
  return diff > 0 ? `+${fmtInt(diff)}` : fmtInt(diff);
}

/** engagement_time_msec 合計と回数から 1回あたりの滞在秒数を出す */
export function fmtEngagementSec(engagementMs: number, views: number): string {
  if (views <= 0) return "-";
  return `${Math.round(engagementMs / views / 1000)}秒`;
}

/** そのページがセッション内最後の page_view だった割合 (離脱率) */
export function fmtExitRate(exits: number, views: number): string {
  if (views <= 0) return "-";
  return `${Math.round((exits / views) * 100)}%`;
}

/** 日付文字列 (YYYY-MM-DD) を「6/30」形式にする */
export function fmtShortDate(date: string): string {
  const [, m, d] = date.split("-");
  return `${Number(m)}/${Number(d)}`;
}

/**
 * 日次配列から「データ最終日基準の直近28日」と「その前28日」の合計を出す。
 * pick で対象メトリクスを選ぶ。
 */
export function sumWindows<T extends { date: string }>(
  daily: T[],
  end: string | null,
  pick: (row: T) => number,
): { current: number; previous: number } {
  if (!end) return { current: 0, previous: 0 };
  const endDate = new Date(`${end}T00:00:00Z`);
  const dayMs = 24 * 60 * 60 * 1000;
  const cutoff28 = new Date(endDate.getTime() - 28 * dayMs);
  const cutoff56 = new Date(endDate.getTime() - 56 * dayMs);
  let current = 0;
  let previous = 0;
  for (const row of daily) {
    const d = new Date(`${row.date}T00:00:00Z`);
    if (d > cutoff28) current += pick(row);
    else if (d > cutoff56) previous += pick(row);
  }
  return { current, previous };
}
