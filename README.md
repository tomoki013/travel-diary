[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/tomoki013/travel-diary)

# ともきちの旅行日記 - A Next.js Travel Blog

[Deploy with Netlify](https://tomokichidiary.com)

**ともきちの旅行日記**は、「旅に出るワクワク感」をコンセプトにした、モダンな技術で構築された個人旅行ブログです。インタラクティブな世界地図やテーマ別のシリーズ記事を通じて、読者の冒険心を刺激するユニークな視覚体験を提供します。

---

## ✨ 主な特徴

このプロジェクトは、多機能でメンテナンス性の高いブログサイトを実現するための様々な機能を備えています。

- **インタラクティブな世界地図**: `D3.js`を利用したクリック可能な世界地図から、直感的に旅先を探せます。
- **動的なコンテンツハブ**: 国・地域別の「Destinationページ」や、テーマ別の「Seriesページ」を自動生成し、関連コンテンツをまとめて表示します。
- **Markdownベースのコンテンツ**: 記事はすべてMarkdownで管理されており、`gray-matter`によるフロントマターで豊富なメタデータを扱えます。
- **カスタムMarkdownコンポーネント**: 内部リンクカードや、デザインされたテーブルなど、Markdownの表現力を拡張するカスタムコンポーネントを実装しています。
- **豊富なアニメーション**: `Framer Motion`による心地よいページ遷移やローディングアニメーションが、サイト体験を向上させます。
- **ユーザー参加型機能**: 読者が記事のテーマをリクエストできる専用ページを設置し、「ユーザーと共に作り上げるメディア」を目指します。
- **レスポンシブデザイン**: PC、タブレット、スマートフォンなど、あらゆるデバイスで最適化された表示を実現します。

---

## 🛠️ 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/) (App Router)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **アニメーション**: [Framer Motion](https://www.framer.com/motion/)
- **地図描画**: [D3.js](https://d3js.org/)
- **Markdown処理**: [React Markdown](https://github.com/remarkjs/react-markdown), [Gray Matter](https://github.com/jonschlinkert/gray-matter)
- **デプロイメント**: [Netlify](https://netlify.com/)

---

## 🚀 導入方法

このプロジェクトをローカル環境でセットアップする手順は以下の通りです。

1. **リポジトリをクローン**:

```bash
git clone https://github.com/tomoki013/new-travelblog.git
```

2. **ディレクトリを移動**:

```bash
cd new-travelblog
```

3. **依存関係をインストール**:

```bash
npm install
# or
yarn install
```

4. **開発サーバーを起動**:

```bash
npm run dev
# or
yarn dev
```

5. **ブラウザで確認**:
   ブラウザで `http://localhost:3000` を開くと、サイトが表示されます。

---

## 🌐 ドメイン切替（1箇所で反転）

本番で使う正規ドメインは `NEXT_PUBLIC_SITE_URL` で切り替えできます。

- 現在の既定値: `https://tomokichidiary.com`
- 以前の値へ戻す場合: `https://travel.tomokichidiary.com`

例（Netlify/環境変数）:

```bash
NEXT_PUBLIC_SITE_URL=https://tomokichidiary.com
```

この値は `metadataBase/canonical/og/sitemap/robots` に反映されます。

---

## 📁 ディレクトリ構成

プロジェクトの主要なディレクトリ構成です。

```text
.
├── src
│ ├── app/ # App Routerのルートとページ
│ ├── components/ # 再利用可能なUIコンポーネント
│ ├── data/ # 地域情報などの静的データ
│ ├── lib/ # 汎用的なヘルパー関数
│ └── posts/ # Markdown形式のブログ記事
├── public/ # 画像などの静的アセット
└── README.md
```

---

## 📝 コンテンツ管理

新しいブログ記事は、`src/posts/` ディレクトリ内にMarkdownファイル (`.md`) として追加します。
各記事ファイルは、メタデータを定義する**フロントマター**を持つ必要があります。

**例 (`example-post.md`):**

```markdown
---
category: category
title: title
dates:
  - "2025-06-22"
excerpt: >-
  description
image: /images/
location: location
author: ともきち
series: kyoto
budget: 368509
costs:
  flight: 123940
  train: 5180
  hotel: 116328
  transport: 17939
  sightseeing: 17126
  food: 78346
tags:
  - 海外旅行
isPromotion: true
---

## ここから本文

Markdown記法で自由に記事を記述できます。
```

## 🤝 貢献

このプロジェクトへの貢献に興味がある場合は、以下の手順でプルリクエストを送ってください。

1. このリポジトリをフォークします。
2. 新しいブランチを作成します (`git checkout -b feature/your-feature-name`)。
3. 変更をコミットします (`git commit -m 'Add some feature'`)。
4. ブランチにプッシュします (`git push origin feature/your-feature-name`)。
5. プルリクエストを作成します。

---

## 📜 ライセンス

このプロジェクトは個人利用を目的としており、ライセンスは付与されていません。
