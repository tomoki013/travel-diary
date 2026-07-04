// /admin/analytics ダッシュボードが読む BigQuery スナップショットの型。
// スナップショットは scripts/generate-analytics-snapshot.mjs が生成する
// src/data/analytics/snapshot.json。クエリ列とここの型を必ず同期させること。

/** GSC サイト全体の日次集計 */
export interface GscDailyRow {
  date: string; // YYYY-MM-DD
  impressions: number;
  clicks: number;
  /** 平均掲載順位 (= sum_position/impressions + 1)。表示0の日は null */
  position: number | null;
}

/** GSC の URL(パス)別集計。28日系はデータ最終日基準の直近/その前28日 */
export interface GscPageRow {
  path: string;
  impressions: number;
  clicks: number;
  position: number | null;
  impressions28: number;
  clicks28: number;
  position28: number | null;
  impressionsPrev28: number;
  clicksPrev28: number;
}

/** GSC の URL×週 (月曜始まり) 集計。スパークライン用 */
export interface GscPageWeeklyRow {
  path: string;
  week: string; // 週初日 YYYY-MM-DD
  impressions: number;
  clicks: number;
  position: number | null;
}

/** GSC の検索クエリ×URL 集計 (匿名化クエリは含まない) */
export interface GscQueryRow {
  query: string;
  path: string;
  impressions: number;
  clicks: number;
  position: number | null;
  impressions28: number;
  clicks28: number;
  position28: number | null;
}

/** GA4 サイト全体の日次集計 */
export interface Ga4DailyRow {
  date: string; // YYYY-MM-DD
  pageViews: number;
  sessions: number;
  users: number;
}

/** GA4 のページ(パス)別集計。exits はそのページがセッション内最後の page_view だった回数 (離脱) */
export interface Ga4PageRow {
  path: string;
  views: number;
  users: number;
  engagementMs: number;
  views28: number;
  engagementMs28: number;
  exits: number;
  exits28: number;
}

/** GA4 の流入元 (source/medium) 別セッション数 */
export interface Ga4SourceRow {
  source: string;
  medium: string;
  sessions: number;
  sessions28: number;
}

/** GA4 拡張計測イベント (scroll/click/form_start 等) のサイト全体の発生回数 */
export interface Ga4EventRow {
  eventName: string;
  count: number;
  count28: number;
}

export interface AnalyticsSnapshot {
  generatedAt: string; // ISO 8601
  gsc: {
    range: { start: string | null; end: string | null };
    daily: GscDailyRow[];
    pages: GscPageRow[];
    pagesWeekly: GscPageWeeklyRow[];
    queries: GscQueryRow[];
  };
  ga4: {
    range: { start: string | null; end: string | null };
    daily: Ga4DailyRow[];
    pages: Ga4PageRow[];
    sources: Ga4SourceRow[];
    events: Ga4EventRow[];
  };
}

/** 施策ウォッチ対象 (SEO施策を打った記事の効果測定リスト) */
export interface AnalyticsWatchlistEntry {
  path: string;
  /** 打った施策の内容 */
  note: string;
  /** 施策日 (YYYY-MM-DD)。この日以降の変化を見る */
  since: string;
}

/** ダッシュボード表示用の記事情報 (パス → 記事メタデータ) */
export interface AnalyticsPostInfo {
  title: string;
  category: string;
  noindex: boolean;
}
