# 開発ドキュメント

このディレクトリは、このリポジトリの開発・運用・AI 協業の基準をまとめる場所です。

## 入口

- `architecture.md`: アプリ構成、主要ディレクトリ、データの流れ
- `development-workflow.md`: セットアップ、主要コマンド、日常の開発手順
- `content-operations.md`: 記事・下書き・frontmatter・ビルド前生成の運用
- `page-map.md`: 主要ページの役割と、どの導線に責任を持つか
- `ai-maintenance.md`: AI 向けルール、同期対象、更新義務

## 運用ルール

- 実装・運用・記事制作フローに変更が入ったら、まずこの `docs/` を更新します。
- 変更が AI の振る舞いに影響する場合は、同じ変更内で `AGENTS.md`、`CLAUDE.md`、`GEMINI.md` も必ず更新します。
- ルートの 3 ファイルは要約版、`docs/` は source of truth として扱います。
