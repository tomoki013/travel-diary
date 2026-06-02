# 設計・知見系ファイル棚卸表

> 生成日: 2026-06-02
> 対象: `docs/`、`draft-posts/rules/`、ルートの設定ファイル群

---

## サマリー

- 残す: 13件
- 統合: 0件
- 削除候補: 0件
- 要更新（Netlify依存の記述あり）: 1件
- 保留: 0件

---

## docs/ ディレクトリ

| path | 種別 | 現在の役割 | 内容の鮮度 | 重複 | 外部公開 | 判定 | 理由 |
|---|---|---|---|---|---|---|---|
| [docs/README.md](../docs/README.md) | インデックス | `docs/` の目次 | 最新 | なし | される | **残す** | `docs/` の入口として必要。 |
| [docs/ai-maintenance.md](../docs/ai-maintenance.md) | 運用手順 | AIが参照するsource of truthの同期ルール | 最新 | なし | される | **残す** | CLAUDE.md / GEMINI.md の整合性保持に使っている。 |
| [docs/architecture.md](../docs/architecture.md) | 設計書 | 技術スタック・ディレクトリ構成・ページ実装パターン | 最新 | なし | される | **残す** | 現行アーキテクチャを正確に記述。Vercel移行後は「ホスティング: Netlify」の記述を更新する。 |
| [docs/content-operations.md](../docs/content-operations.md) | 運用手順 | 記事の置き場所・frontmatter・ビルドとの関係 | 一部古い | なし | される | **残す（要更新）** | `dates` フィールドが実際には `publishedAt` + `travelDates` に分離されているが記載が古い可能性あり。確認推奨。 |
| [docs/development-workflow.md](../docs/development-workflow.md) | 運用手順 | 開発コマンド・日常の進め方・変更時の注意 | 最新 | なし | される | **残す** | 現状の開発フローを正確に記述。 |
| [docs/infrastructure.md](../docs/infrastructure.md) | 設計書 | ホスティング・画像最適化・AI基盤・MCP | **Netlify前提の記述** | なし | される | **残す（Vercel移行後に要更新）** | Netlify前提の内容が多い。Vercel移行後は全面更新が必要。移行前は現状記録として残す。 |
| [docs/page-map.md](../docs/page-map.md) | 設計書 | 主要ページの役割・情報設計の優先順位 | 最新 | なし | される | **残す** | 現在のページ設計を正確に記述。問題なし。 |
| [docs/seo-aio-operation.md](../docs/seo-aio-operation.md) | 運用手順 | SEO・AIO運用ガイドライン | 最新 | なし | される | **残す** | 現在の記事作成方針と一致している。AdSense審査対策にも有用。 |

---

## draft-posts/rules/ ディレクトリ

| path | 種別 | 現在の役割 | 内容の鮮度 | 重複 | 外部公開 | 判定 | 理由 |
|---|---|---|---|---|---|---|---|
| [draft-posts/rules/README.md](../draft-posts/rules/README.md) | インデックス | `rules/` の目次・各ファイルの使い分け説明 | 最新 | なし | されない | **残す** | ルールディレクトリの入口として必要。 |
| [draft-posts/rules/EDITORIAL_BASELINE.md](../draft-posts/rules/EDITORIAL_BASELINE.md) | 設計書 | 全記事共通の編集ルール正本 | 最新 | なし | されない | **残す** | AI・運営者が記事編集時に最初に参照するファイル。 |
| [draft-posts/rules/CONTENT_STRATEGY.md](../draft-posts/rules/CONTENT_STRATEGY.md) | 設計書 | カテゴリごとの目的・主観・客観の比率 | 最新 | なし | されない | **残す** | カテゴリ判断の基準として使っている。 |
| [draft-posts/rules/TRAVEL_DIARY_RULES.md](../draft-posts/rules/TRAVEL_DIARY_RULES.md) | 設計書 | `series: travel-diary` 専用の記事ルール | 最新 | なし | されない | **残す** | シリーズ旅行記の品質を揃える中心的なルール。 |
| [draft-posts/rules/OPERATIONS.md](../draft-posts/rules/OPERATIONS.md) | 運用手順 | frontmatter・命名・公開前チェックなど | 最新 | なし | されない | **残す** | 運用仕様の正本。AIが参照する。 |
| [draft-posts/rules/SOURCE_CONVERSION.md](../draft-posts/rules/SOURCE_CONVERSION.md) | 設計書 | Note記事・外部テキストを本ブログ原稿に変換するルール | 最新 | なし | されない | **残す** | Note連携を行う際に使用。不要になったときは削除候補。 |

---

## ルート設定ファイル

| path | 種別 | 現在の役割 | 内容の鮮度 | 重複 | 外部公開 | 判定 | 理由 |
|---|---|---|---|---|---|---|---|
| `netlify.toml` | デプロイ設定 | ビルド設定・リダイレクト・キャッシュヘッダー | Netlify前提 | なし | される | **Vercel移行後に廃止** | Vercel移行後は不要になる。移行ステップで `next.config.ts` / `vercel.json` に内容を移行。 |
| `CLAUDE.md` | AIルール | Claude Codeへの指示・プロジェクト概要 | 最新 | なし | される | **残す** | Claude Codeの動作を制御する。 |

---

## Vercel移行時のファイル影響まとめ

### 更新が必要なファイル

| ファイル | 更新内容 |
|---|---|
| `docs/infrastructure.md` | Netlify → Vercel に書き換え。画像最適化ローダーの変更も反映。 |
| `docs/content-operations.md` | frontmatterのフィールド名を現行の実装と照合・修正。 |
| `netlify.toml` | Vercel移行後に廃止。リダイレクトを `next.config.ts` に移管。 |

### 廃止するファイル

| ファイル | タイミング |
|---|---|
| `netlify.toml` | Vercel本番切り替え後 |

### 移行後に追加するファイル

| ファイル | 内容 |
|---|---|
| `vercel.json` または `next.config.ts` | リダイレクト・ヘッダー設定をVercel形式で記述 |

---

## 今回スコープ外のファイル

以下は今回の棚卸対象にしない（コードファイルのため）。

- `src/` 配下の全コンポーネント・ロジック
- `scripts/` 配下のビルドスクリプト
- `public/` 配下の画像・静的ファイル
- `posts/` 配下の記事本文（記事棚卸表で個別評価済み）
- `draft-posts/` 配下の下書き記事
