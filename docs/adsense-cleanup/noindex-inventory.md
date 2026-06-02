# noindex設定一覧

> 調査日: 2026-06-02
> 調査対象: `src/app/` 配下の全ページ metadata、`netlify.toml`、`next-sitemap.config.js`

---

## サマリー

| 分類                               | 件数 |
| ---------------------------------- | ---- |
| 現在すでにnoindex設定済み          | 10件 |
| noindexなし・index対象（問題なし） | 15件 |
| noindexなし・**今後noindex推奨**   | 2件  |

---

## 現在noindex設定済みのページ

| URL/route                 | ファイルパス                                 | noindex設定方法                                     | sitemap掲載                          | 内部リンク有無                 | 現状判定                     |
| ------------------------- | -------------------------------------------- | --------------------------------------------------- | ------------------------------------ | ------------------------------ | ---------------------------- |
| `/social`                 | `src/app/(pages)/social/page.tsx`            | `metadata.robots.index = false`                     | なし                                 | フッターなし、NAVなし          | 適切。維持。                 |
| `/request`                | `src/app/(pages)/request/page.tsx`           | `metadata.robots.index = false`                     | なし                                 | フッターあり（コミュニティ）   | 適切。維持。                 |
| `/travel-essentials`      | `src/app/(pages)/travel-essentials/page.tsx` | `metadata.robots.index = false`                     | なし                                 | フッターあり（サイトについて） | 適切。維持。                 |
| `/series`                 | `src/app/(pages)/series/page.tsx`            | `metadata.robots.index = false`                     | なし                                 | フッターあり（コンテンツ）     | 適切。維持。                 |
| `/series/[slug]`          | `src/app/(pages)/series/[slug]/page.tsx`     | `generateMetadata` で `robots.index = false`        | なし                                 | シリーズ一覧から遷移           | 適切。維持。                 |
| `/gallery`                | `src/app/(pages)/gallery/page.tsx`           | `metadata.robots.index = false`                     | なし                                 | NAVあり                        | 適切。ギャラリーは補助機能。 |
| `/sitemap`                | `src/app/(pages)/sitemap/page.tsx`           | `metadata.robots.index = false`                     | なし                                 | フッターあり（サイトについて） | 適切。維持。                 |
| `/preview/*`              | `src/app/(pages)/preview/[slug]/page.tsx`    | `metadata.robots.index = false`                     | なし                                 | なし（内部プレビュー）         | 適切。維持。                 |
| `/(labs)/generative-ui/*` | `src/app/(labs)/layout.tsx`                  | `metadata.robots = { index: false, follow: false }` | なし（netlify.tomlでもX-Robots-Tag） | なし                           | 適切。実験的機能。           |

---

## noindexなし・index対象（問題なし）

| URL/route               | 役割                 | 評価                                          |
| ----------------------- | -------------------- | --------------------------------------------- |
| `/`                     | トップページ         | インデックス必須                              |
| `/posts`                | 記事一覧             | インデックス必須                              |
| `/posts/[slug]`         | 記事詳細             | インデックス必須（記事品質で個別評価）        |
| `/destination`          | 地域一覧             | インデックス対象として適切                    |
| `/destination/[region]` | 地域別ページ         | インデックス対象（記事数により要確認）        |
| `/about`                | 運営者紹介           | E-E-A-T観点で重要。インデックス必須           |
| `/faq`                  | よくある質問         | canonical設定あり。インデックス対象として適切 |
| `/editorial-policy`     | 執筆・編集ポリシー   | E-E-A-T観点で重要。インデックス対象として適切 |
| `/privacy`              | プライバシーポリシー | インデックス対象として適切                    |
| `/cookie-policy`        | クッキーポリシー     | インデックス対象として適切                    |
| `/terms`                | 利用規約             | インデックス対象として適切                    |
| `/contact`              | お問い合わせ         | E-E-A-T観点で重要。インデックス対象として適切 |
| `/journey`              | 旅程一覧             | インデックス対象として適切                    |
| `/journey/[id]`         | 旅程詳細             | インデックス対象として適切                    |
| `/offline`              | オフラインページ     | PWA用。そもそもクロール不可                   |

---

## noindexなし・**今後noindex推奨**

| URL/route     | ファイルパス                          | 現状                                                           | 問題                                                                                                                       | 推奨対応                                                           |
| ------------- | ------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `/roadmap`    | `src/app/(pages)/roadmap/page.tsx`    | `"use client"` で metadata export なし → デフォルトでindex対象 | sitemap掲載中。「Future Roadmap」「To Be Continued...」等の未完成感を連想させる文言あり。AdSense審査でマイナス評価のリスク | `layout.tsx` を新設して `metadata.robots.index = false` を追加する |
| `/affiliates` | `src/app/(pages)/affiliates/page.tsx` | metadata export なし → デフォルトでindex対象                   | sitemap掲載中。アフィリエイトポリシーと参加プログラム一覧のみで構成。「収益化ページ」として見られるリスクあり              | `metadata` を追加して `robots.index = false` を設定する            |

---

## sitemap設定の確認

### `next-sitemap.config.js` の明示的 exclude

```js
exclude: ["/dashboard", "/loading-animation", "/offline"];
```

この3つ以外はsitemapから明示除外されていない。

### noindex設定とsitmapの関係

next-sitemap はデフォルトでは `metadata.robots.index = false` のページを自動除外しない場合がある（バージョン依存）。ただし、next-sitemap v4.x では `transform` オプションで制御できる。

**要確認**: `pnpm build` 後に生成される `public/sitemap.xml` を開き、以下のページが含まれていないことを確認する。

確認すべき除外対象:

- `/social`
- `/request`
- `/travel-essentials`
- `/series`
- `/series/*` (travel-diary, travel-history, sunset, etc.)
- `/gallery`
- `/sitemap`

もしこれらがsitemap.xmlに含まれている場合は、`next-sitemap.config.js` の `exclude` に追加するか、`transform` 関数を使ってnoindexページを除外する設定を追加する。

---

## `robots.txt` の現状

```txt
User-agent: *
Allow: /
Host: https://tomokichidiary.com
Sitemap: https://tomokichidiary.com/sitemap.xml
```

`Disallow` 設定なし。全ページのクロールを許可している。問題のあるページはページレベルのnoindexで対応しているため、現状は問題なし。

---

## Vercel移行時の追加考慮点

| 項目              | 内容                                                                                                                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/(labs)` noindex | 現在は `netlify.toml` の `X-Robots-Tag: noindex, nofollow` でも対応。Vercel移行後は `next.config.ts` の `headers()` に移行が必要。`layout.tsx` 側の metadata でも設定済みのため、移行後も機能する。 |
| noindex全体       | Next.js の `metadata.robots` はVercel環境でも機能する。Netlify固有の設定ではないため、移行時の変更は不要。                                                                                          |
