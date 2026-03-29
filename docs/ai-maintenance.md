# AI ルールと同期ポリシー

## source of truth

- 開発・運用・コンテンツ制作の詳細ルールは `docs/` を source of truth とします。
- `AGENTS.md`、`CLAUDE.md`、`GEMINI.md` は AI ごとの要約と入口です。

## 必須同期ルール

- 実装に伴って仕様、運用、コンテンツ制作ルール、ページ責務、開発フローが変わった場合は、同じ変更内で `docs/` を更新します。
- その変更が AI の判断や作業手順に影響する場合は、`AGENTS.md`、`CLAUDE.md`、`GEMINI.md` を同じ変更内で必ず更新します。
- 3 ファイルのどれか 1 つだけが古い状態を残さないことをルールとします。

## AI が最低限確認するもの

- 記事編集時: `draft-posts/rules/` と `docs/content-operations.md`
- 構造変更時: `docs/architecture.md` と `docs/page-map.md`
- 運用変更時: `docs/development-workflow.md` とこのファイル
