# アナリティクス管理画面 (/admin/analytics)

GSC (Google Search Console) と GA4 の BigQuery エクスポートを集計して見る運営者用ダッシュボード。

## 構成

```
BigQuery (tomokichidiary-analytics)
  ├─ searchconsole.searchdata_url_impression   … GSC 日次エクスポート (2026-05-02〜)
  └─ analytics_535794382.events_YYYYMMDD       … GA4 日次エクスポート (2026-05-03〜)
        │
        │  scripts/generate-analytics-snapshot.mjs を手動実行 (bq CLI)
        ▼
src/data/analytics/snapshot.json               … 集計済みスナップショット (コミットする)
        │
        │  ビルド時に静的 import
        ▼
/admin/analytics                               … ダッシュボード (Cookie 認証)
```

- 自動更新はしない。データを更新したいときに `node scripts/generate-analytics-snapshot.mjs` を実行し、生成された `snapshot.json` をコミット・デプロイする（Claude に「アナリティクス更新して」と依頼すればよい）。
- 実行の前提: Google Cloud SDK の `bq` CLI が `tomokichidiary-analytics` プロジェクトへ読み取り可能なアカウントで認証済みであること。
- スナップショットのクエリ列と `src/types/analytics.ts` の型は必ず同期させる。

## 認証

- `/api/preview-login` と同じ「環境変数パスワード + Cookie」方式。
  - 環境変数: `ANALYTICS_PASSWORD`（未設定の環境ではページ自体が 404）
  - Cookie: `analytics_auth`（httpOnly、30日）
  - ログイン: `/admin/analytics/login` → `POST /api/analytics-login`
- 本番 (Netlify) で使うには環境変数 `ANALYTICS_PASSWORD` の設定が必要。ローカルは `.env.local` に書く。
- 全ページ noindex + `next-sitemap.config.js` の exclude 対象（`/admin`, `/admin/*`）。

## 画面の内容

| タブ         | 内容                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| 概要         | 28日 KPI（表示・クリック・CTR・順位・セッション・PV、前28日比）、GSC/GA4 日次チャート、クリック上位ページ、流入元 |
| 記事別       | 全記事 × GSC/GA4 の横断テーブル（ソート・絞り込み・週次スパークライン、実用記事なのに表示0のものに警告バッジ）    |
| 検索クエリ   | あと一歩キーワード（順位4〜20位 = リライト候補）、トップクエリ                                                    |
| 施策ウォッチ | SEO 施策を打った記事の経過観察。対象は `src/data/analytics/watchlist.ts` で管理                                   |

## 集計仕様のメモ

- GSC の平均掲載順位 = `SUM(sum_position) / SUM(impressions) + 1`
- GSC の URL には `#フラグメント` 付きの行が混ざるため集計時に除去している
- 「直近28日」はカレンダーではなく **データが存在する最終日** 基準（GSC エクスポートは2〜3日遅れるため）
- GA4 の `events_*` ワイルドカードは `events_intraday_*` にも一致するので、`_TABLE_SUFFIX` を8桁数字に限定して重複を防いでいる
- GSC の「カバレッジ（インデックス未登録の理由）」は BigQuery にエクスポートされない。Search Console の UI でしか見られない
