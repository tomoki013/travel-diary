# アナリティクス管理画面 (/admin/analytics)

GSC (Google Search Console) と GA4 の BigQuery エクスポートを集計して見る運営者用ダッシュボード。

## 構成

```
BigQuery (tomokichidiary-analytics)
  ├─ searchconsole.searchdata_url_impression   … GSC 日次エクスポート (2026-05-02〜)
  └─ analytics_535794382.events_YYYYMMDD       … GA4 日次エクスポート (2026-05-03〜)
        │
        │  毎週水曜 07:00 JST に GitHub Actions から
        │  scripts/generate-analytics-snapshot.mjs を実行 (bq CLI)
        ▼
src/data/analytics/snapshot.json               … 集計済みスナップショット (自動コミット)
        │
        │  main 更新 → Netlify デプロイ → ビルド時に静的 import
        ▼
/admin/analytics                               … ダッシュボード (Cookie 認証)
```

- `.github/workflows/analytics-snapshot.yml` が毎週水曜 07:00 JST（火曜 22:00 UTC）に自動実行する。
- GitHub Actions の `workflow_dispatch` から手動更新も可能。
- スナップショットに差分がある場合のみ `src/data/analytics/snapshot.json` を `main` へ自動コミットする。
- GitHub Actions では Repository Secret `GCP_ANALYTICS_CREDENTIALS` を使用する。値には `tomokichidiary-analytics` を読み取れる Google Cloud サービスアカウントの JSON 認証情報を設定する。
- サービスアカウントは分析データの読み取りに必要な最小権限のみを付与し、BigQuery への書き込み権限は与えない。
- ローカルで手動生成する場合は `node scripts/generate-analytics-snapshot.mjs` を実行する。Google Cloud SDK の `bq` CLI が `tomokichidiary-analytics` を読み取れるアカウントで認証済みであること。
- スナップショットのクエリ列と `src/types/analytics.ts` の型は必ず同期させる。

## 認証

- `/api/preview-login` と同じ「環境変数パスワード + Cookie」方式。
  - 環境変数: `ANALYTICS_PASSWORD`（未設定の環境ではページ自体が 404）
  - Cookie: `analytics_auth`（httpOnly、30日）
  - ログイン: `/admin/analytics/login` → `POST /api/analytics-login`
- 本番 (Netlify) で使うには環境変数 `ANALYTICS_PASSWORD` の設定が必要。ローカルは `.env.local` に書く。
- 全ページ noindex + `next-sitemap.config.js` の exclude 対象（`/admin`, `/admin/*`）。

## 画面の内容

| タブ         | 内容                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 概要         | 28日 KPI（表示・クリック・CTR・順位・セッション・PV、前28日比＋ミニ推移）、GSC/GA4 日次チャート、クリック上位ページ、流入元、曜日パターン（曜日別の1日平均）                                                                                                                                                                                                                                                  |
| インサイト   | クエリ健康度（TOP3/TOP10/11〜20位数）と改善アクションの自動抽出。①リライト候補（順位4〜20位のクエリを記事単位に束ね、3位相当の期待CTRとの差から見込みクリック増でスコア化）② CTR×順位の散布図（期待CTRカーブ重ね描き）と順位分布 ③タイトル改善候補（順位の期待CTRに対して実CTRが6割未満）④新しく検索に出始めたクエリ ⑤伸びている/落ちているページ（完結週ベースで直近2週 vs その前2週、±30%）⑥表示0の実用記事 |
| 記事別       | 全記事 × GSC/GA4 の横断テーブル（ソート・絞り込み・週次スパークライン・傾向アイコン、実用記事なのに表示0のものに警告バッジ）                                                                                                                                                                                                                                                                                  |
| 検索クエリ   | あと一歩キーワード（順位4〜20位 = リライト候補）、トップクエリ                                                                                                                                                                                                                                                                                                                                                |
| 施策ウォッチ | SEO 施策を打った記事の経過観察（改善/横ばい/悪化/表示なし判定付き）。対象は `src/data/analytics/watchlist.ts` で管理                                                                                                                                                                                                                                                                                          |

分析ロジック（期待CTRカーブ・モメンタム判定・しきい値）は `src/components/features/analytics/insights.ts` に集約している。

## デザイン

サイト本体のテーマ (stone/amber・ライト/ダーク) から独立した**常時ダークの分析コンソール**として描画する。配色・パネル・バッジ等のトークンは `src/components/features/analytics/theme.ts` に集約しており、チャート (SVG 自前描画、`charts.tsx`) もここのカラーを使う。サイト側のデザイン変更に追従させる必要はない。

## 集計仕様のメモ

- GSC の平均掲載順位 = `SUM(sum_position) / SUM(impressions) + 1`
- GSC の URL には `#フラグメント` 付きの行が混ざるため集計時に除去している
- 「直近28日」はカレンダーではなく **データが存在する最終日** 基準（GSC エクスポートは2〜3日遅れるため）
- GA4 の `events_*` ワイルドカードは `events_intraday_*` にも一致するので、`_TABLE_SUFFIX` を8桁数字に限定して重複を防いでいる
- GSC の「カバレッジ（インデックス未登録の理由）」は BigQuery にエクスポートされない。Search Console の UI でしか見られない
