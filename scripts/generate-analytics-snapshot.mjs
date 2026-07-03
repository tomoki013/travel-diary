// GSC/GA4 の BigQuery エクスポートを集計し、管理ダッシュボード
// (/admin/analytics) が読む静的スナップショット JSON を生成する。
//
// 使い方:  node scripts/generate-analytics-snapshot.mjs
// 前提:    bq CLI (Google Cloud SDK) がインストール済みで、
//          tomokichidiary-analytics プロジェクトに読み取り権限のある
//          アカウントで認証済みであること (bq ls で確認可)。
// 出力:    src/data/analytics/snapshot.json (リポジトリにコミットする)
//
// 定期実行はせず、更新したいタイミングで手動実行する運用。
// クエリ設計メモ:
// - GSC の平均掲載順位 = SUM(sum_position) / SUM(impressions) + 1
// - GSC の url には #フラグメント付きの行が混ざるため集計前に除去する
// - GA4 の events_* ワイルドカードは events_intraday_* にもマッチするため
//   _TABLE_SUFFIX を8桁数字に限定して当日仮テーブルの重複を避ける

import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT = "tomokichidiary-analytics";
const GSC_TABLE = `\`${PROJECT}.searchconsole.searchdata_url_impression\``;
const GA4_TABLE = `\`${PROJECT}.analytics_535794382.events_*\``;

// URL → サイト内パスへ正規化 (オリジンと #fragment を除去)
const GSC_PATH = `REGEXP_REPLACE(REGEXP_REPLACE(url, r'#.*$', ''), r'^https?://[^/]+', '')`;
const GA4_PATH = `REGEXP_REPLACE(REGEXP_REPLACE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location'), r'[#?].*$', ''), r'^https?://[^/]+', '')`;
const GA4_DAILY_SUFFIX = `REGEXP_CONTAINS(_TABLE_SUFFIX, r'^\\d{8}$')`;

// 直近28日 / その前28日 の比較は「データが存在する最終日」を基準にする
const GSC_BASE = `
  WITH t AS (
    SELECT data_date, ${GSC_PATH} AS path, query, impressions, clicks, sum_position
    FROM ${GSC_TABLE}
  ),
  mx AS (SELECT MAX(data_date) AS d FROM t)
`;

const queries = {
  gscDaily: `${GSC_BASE}
    SELECT
      CAST(data_date AS STRING) AS date,
      SUM(impressions) AS impressions,
      SUM(clicks) AS clicks,
      ROUND(SAFE_DIVIDE(SUM(sum_position), SUM(impressions)) + 1, 2) AS position
    FROM t
    GROUP BY date
    ORDER BY date`,

  gscPages: `${GSC_BASE}
    SELECT
      path,
      SUM(impressions) AS impressions,
      SUM(clicks) AS clicks,
      ROUND(SAFE_DIVIDE(SUM(sum_position), SUM(impressions)) + 1, 2) AS position,
      SUM(IF(data_date > DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY), impressions, 0)) AS impressions28,
      SUM(IF(data_date > DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY), clicks, 0)) AS clicks28,
      ROUND(SAFE_DIVIDE(
        SUM(IF(data_date > DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY), sum_position, 0)),
        NULLIF(SUM(IF(data_date > DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY), impressions, 0)), 0)
      ) + 1, 2) AS position28,
      SUM(IF(data_date <= DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY)
             AND data_date > DATE_SUB((SELECT d FROM mx), INTERVAL 56 DAY), impressions, 0)) AS impressionsPrev28,
      SUM(IF(data_date <= DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY)
             AND data_date > DATE_SUB((SELECT d FROM mx), INTERVAL 56 DAY), clicks, 0)) AS clicksPrev28
    FROM t
    GROUP BY path
    ORDER BY impressions DESC`,

  gscPagesWeekly: `${GSC_BASE}
    SELECT
      path,
      CAST(DATE_TRUNC(data_date, WEEK(MONDAY)) AS STRING) AS week,
      SUM(impressions) AS impressions,
      SUM(clicks) AS clicks,
      ROUND(SAFE_DIVIDE(SUM(sum_position), SUM(impressions)) + 1, 2) AS position
    FROM t
    GROUP BY path, week
    ORDER BY path, week`,

  // 匿名化クエリ (query IS NULL) は集計対象外
  gscQueries: `${GSC_BASE}
    SELECT
      query,
      path,
      SUM(impressions) AS impressions,
      SUM(clicks) AS clicks,
      ROUND(SAFE_DIVIDE(SUM(sum_position), SUM(impressions)) + 1, 2) AS position,
      SUM(IF(data_date > DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY), impressions, 0)) AS impressions28,
      SUM(IF(data_date > DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY), clicks, 0)) AS clicks28,
      ROUND(SAFE_DIVIDE(
        SUM(IF(data_date > DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY), sum_position, 0)),
        NULLIF(SUM(IF(data_date > DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY), impressions, 0)), 0)
      ) + 1, 2) AS position28
    FROM t
    WHERE query IS NOT NULL
    GROUP BY query, path
    ORDER BY impressions DESC
    LIMIT 1000`,

  ga4Daily: `
    SELECT
      FORMAT_DATE('%Y-%m-%d', PARSE_DATE('%Y%m%d', event_date)) AS date,
      COUNTIF(event_name = 'page_view') AS pageViews,
      COUNT(DISTINCT IF(event_name = 'session_start',
        CONCAT(user_pseudo_id, CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS STRING)),
        NULL)) AS sessions,
      COUNT(DISTINCT user_pseudo_id) AS users
    FROM ${GA4_TABLE}
    WHERE ${GA4_DAILY_SUFFIX}
    GROUP BY date
    ORDER BY date`,

  ga4Pages: `
    WITH t AS (
      SELECT
        PARSE_DATE('%Y%m%d', event_date) AS d,
        event_name,
        ${GA4_PATH} AS path,
        (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'engagement_time_msec') AS engagement_ms,
        user_pseudo_id
      FROM ${GA4_TABLE}
      WHERE ${GA4_DAILY_SUFFIX}
    ),
    mx AS (SELECT MAX(d) AS d FROM t)
    SELECT
      path,
      COUNTIF(event_name = 'page_view') AS views,
      COUNT(DISTINCT user_pseudo_id) AS users,
      SUM(COALESCE(engagement_ms, 0)) AS engagementMs,
      COUNTIF(event_name = 'page_view' AND d > DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY)) AS views28,
      SUM(IF(d > DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY), COALESCE(engagement_ms, 0), 0)) AS engagementMs28
    FROM t
    WHERE path IS NOT NULL
    GROUP BY path
    ORDER BY views DESC`,

  ga4Sources: `
    WITH t AS (
      SELECT
        PARSE_DATE('%Y%m%d', event_date) AS d,
        COALESCE(collected_traffic_source.manual_source, '(direct)') AS source,
        COALESCE(collected_traffic_source.manual_medium, '(none)') AS medium
      FROM ${GA4_TABLE}
      WHERE ${GA4_DAILY_SUFFIX} AND event_name = 'session_start'
    ),
    mx AS (SELECT MAX(d) AS d FROM t)
    SELECT
      source,
      medium,
      COUNT(*) AS sessions,
      COUNTIF(d > DATE_SUB((SELECT d FROM mx), INTERVAL 28 DAY)) AS sessions28
    FROM t
    GROUP BY source, medium
    ORDER BY sessions DESC
    LIMIT 50`,
};

function runQuery(name, sql) {
  process.stderr.write(`  ${name} ... `);
  const result = spawnSync(
    "bq",
    [
      "query",
      `--project_id=${PROJECT}`,
      "--use_legacy_sql=false",
      "--format=json",
      "--max_rows=100000",
      "--quiet",
    ],
    {
      input: sql,
      shell: true,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      // bq (Python製) は Windows だと日本語をコンソールのコードページ
      // (CP932) で出力して JSON が壊れるため、UTF-8 出力を強制する
      env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" },
    },
  );
  if (result.status !== 0) {
    process.stderr.write("FAILED\n");
    throw new Error(`bq query "${name}" failed:\n${result.stderr}`);
  }
  // --quiet でもジョブ待ちのログが stdout 先頭に混ざることがあるため
  // JSON 配列の開始位置から読む
  const stdout = result.stdout;
  const jsonStart = stdout.indexOf("[");
  if (jsonStart === -1) {
    throw new Error(`bq query "${name}" returned no JSON:\n${stdout}`);
  }
  const rows = JSON.parse(stdout.slice(jsonStart));
  process.stderr.write(`${rows.length} rows\n`);
  return rows;
}

// bq の JSON 出力は数値も文字列で返るため、数値らしき値を number へ戻す
function coerceNumbers(rows) {
  return rows.map((row) => {
    const out = {};
    for (const [key, value] of Object.entries(row)) {
      out[key] =
        typeof value === "string" && value !== "" && /^-?\d+(\.\d+)?$/.test(value)
          ? Number(value)
          : value;
    }
    return out;
  });
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "src", "data", "analytics");
const outFile = path.join(outDir, "snapshot.json");

process.stderr.write("Generating analytics snapshot from BigQuery...\n");

const data = {};
for (const [name, sql] of Object.entries(queries)) {
  data[name] = coerceNumbers(runQuery(name, sql));
}

const gscDates = data.gscDaily.map((r) => r.date);
const ga4Dates = data.ga4Daily.map((r) => r.date);

const snapshot = {
  generatedAt: new Date().toISOString(),
  gsc: {
    range: { start: gscDates[0] ?? null, end: gscDates.at(-1) ?? null },
    daily: data.gscDaily,
    pages: data.gscPages,
    pagesWeekly: data.gscPagesWeekly,
    queries: data.gscQueries,
  },
  ga4: {
    range: { start: ga4Dates[0] ?? null, end: ga4Dates.at(-1) ?? null },
    daily: data.ga4Daily,
    pages: data.ga4Pages,
    sources: data.ga4Sources,
  },
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(snapshot, null, 1) + "\n");
process.stderr.write(`Wrote ${path.relative(process.cwd(), outFile)}\n`);
