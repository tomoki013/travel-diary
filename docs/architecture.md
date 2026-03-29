# アーキテクチャ概要

## 技術基盤

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Netlify 配備

## 主要ディレクトリ

- `src/app/`: ルート、Server Component、Client Component
- `src/components/`: UI、共通部品、機能別コンポーネント
- `src/data/`: 地域、カテゴリ、シリーズ、FAQ などの静的データ
- `src/lib/`: 記事取得、地域判定、関連記事、補助ロジック
- `posts/`: 公開記事
- `draft-posts/`: 下書き記事
- `public/images/`: 写真アセットと各ディレクトリの `index.json`

## コンテンツの流れ

- 記事本体は Markdown frontmatter 付きで `posts/` に保存します。
- prebuild で記事キャッシュとメタデータを生成し、一覧・詳細・関連記事で再利用します。
- 写真は `public/images/<region>/` 配下で管理し、`src/lib/photo.ts` が `index.json` と画像実体を読み込みます。

## ページ実装の基本形

- `page.tsx`: データ取得や metadata 定義
- `Client.tsx`: フィルタ、タブ、モーダルなどの操作
- page-level section は `src/components/pages/`
- feature-level UI は `src/components/features/`

## 重要な前提

- ブログ記事が主役です。AI プランナー、Globe、Gallery は補助導線として扱います。
- 地域 slug は `src/data/region.ts` と `src/lib/regionUtil.ts` を基準に揃えます。
