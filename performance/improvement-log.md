# Performance Improvement Log

## 記録ルール

各改善ごとに以下を記録する。

- 日付
- 変更内容
- 目的
- 影響した可能性のある指標
- 計測結果
- 体感
- 次に見ること

## 2026-05 Initial

### 変更前の主な課題

- モバイルPerformance 41
- デスクトップPerformance 63
- TBTがMobileで740ms
- スクロールが重い
- クリック後の反応遅延
- CSSがレンダリングブロックしている
- Webフォントが大量に読み込まれている

## 2026-05 Performance Optimization Phase 1

### 変更内容

- **Fonts**: `layout.tsx` で読み込む Noto Sans JP と Montserrat のウェイトを削減 (500を削除)。`display: swap` を追加。
- **CSS**: `globals.css` の `body` フォントファミリーをシステムフォント優先に変更し、日本語表示時のWebフォント読み込みを遅延・回避。
- **Images**:
  - LCP画像 (`Hero.tsx`) に `fetchPriority="high"` と `sizes="100vw"` を追加。
  - `PostCard.tsx`, `PostHeader.tsx`, `HeroSection.tsx` の `Image` に適切な `sizes` を追加し、表示サイズに最適化された画像を配信するように修正。
  - `netlify-loader.ts` に `quality` パラメータのサポートを追加。
- **JavaScript**:
  - `SearchOverlay` と `GlobePromo` の dynamic import を確認 (既に適用済み)。
  - `post.content` が Client Component 境界を越えない設計を確認 (既に適用済み)。
- **Components**:
  - `Background.tsx` のパーティクル数をモバイルでさらに削減 (12 -> 8)。
  - `TableOfContent` と `FloatingTableOfContent` で DOM スキャンの重複を削減。props で headings が渡された場合に hooks を無効化する `enabled` フラグを導入。
  - `LoadingAnimation` を CSS Modules に移行し、グローバル CSS のサイズを削減。
  - `WorldMap`, `Destination`, `InstallPWAButton`, `SearchOverlay`, `GlobePromo` の dynamic import を徹底し、初期表示の JS 実行時間を短縮。
- **CI/Quality**:
  - GitHub Actions CI ワークフローを追加。
  - Prettier 設定を整備し、`pnpm check` スクリプトを追加。

### 目的

- Render-blocking resources の削減 (CSS/Fonts)
- LCP / FCP の改善 (Image optimization, Font optimization)
- TBT / Main thread work の削減 (TOC DOM scan optimization, Background lightweight)
- 開発品質の維持 (CI/Prettier)

### 影響した可能性のある指標

- FCP, LCP, TBT, Speed Index

### 計測結果 (想定)

- Render-blocking CSS の警告が減少
- woff2 のリクエスト数が減少
- LCP request discovery の改善
- TOC スキャンによるメインスレッド占有の解消

### 次に見ること

- 実際に Netlify 上で計測し、Mobile Performance が 41 から向上しているか確認。
- Forced reflow のさらなる調査 (Header のスクロール処理など)。
- 未使用 JS chunk の詳細分析。

## 2026-06 Font CSS Deduplication + Security/SEO Hardening

### 変更内容

- **Fonts (Root Cause Fix)**: `global-error.tsx` が `next/font/google` で5書体を再定義しており(しかも Noto Sans JP は layout と異なる 400/500/700 構成)、レイアウト側と重複した @font-face CSS が全ページのクリティカルパスに含まれていた。global-error からフォント定義を削除しシステムフォントにフォールバック。
- **SEO**: ルートレイアウトの `alternates.canonical: "/"` が全ページに継承され、ほぼ全ページが「トップページの複製」を宣言していた問題を修正(本番 /about /contact /posts で実証)。`src/lib/page-metadata.ts` の `createPageMetadata()` を新設し、静的ページ約10ページへ個別 canonical を付与。journey の実在しない OG 画像参照も削除。
- **Security**: netlify.toml に HSTS / nosniff / X-Frame-Options / Referrer-Policy / Permissions-Policy を追加。/map(外部アプリのプロキシ)に X-Robots-Tag: noindex。send-email API に zod 検証・レート制限(5通/時/IP)・from 固定+replyTo 化。JSON-LD の `<` エスケープ。postcss の既知脆弱性(GHSA-qx2v-qp2m-jg93)を override で解消。`poweredByHeader: false`。
- **Images**: netlify-loader に品質デフォルト `q=60` を追加。
- **Scripts**: GetYourGuide 計測タグを `ENABLE_AFFILIATES` 有効時のみ読み込みに変更。未使用 preconnect 2件を削除(lazyOnload のため接続が無駄になっていた)。

### 計測結果(ローカルビルド実測)

- トップページ参照 CSS: 8ファイル/約318KB(gzip) → 5ファイル/約162KB(gzip)。**約156KB(49%)削減**。
  - 削除されたチャンク: Noto Sans JP 3ウェイト分(283KB raw / 約90KB gzip)、Shippori Mincho 重複分(189KB raw / 約66KB gzip)
- pnpm audit: 1 moderate → 0件。

### 次に見ること

- デプロイ後に本番 Lighthouse(低速4G・Moto G Power)で FCP/LCP を再計測(前回: FCP 7.7s / LCP 10.7s / TBT 770ms)。
- さらに削る場合は Shippori Mincho 500 の削除(見た目要確認)で残りフォント CSS を約半減できる。
- TBT は framer-motion(Reveal/Header/CookieBanner)の LazyMotion 化が次の候補。
- Search Console で「重複しています」判定ページの再インデックス推移を確認。

## 2026-06 Font Weight Reduction (Shippori Mincho 500)

### 変更内容

- `layout.tsx` の Shippori Mincho を `weight: ["500","700"]` → `"700"` に削減。`.font-heading` 全38箇所が `font-bold`/`font-semibold` 付きであることを確認済みのため見た目への影響なし(500はどこからも要求されていなかった)。

### 計測結果(ローカルビルド実測)

- Shippori Mincho の @font-face CSS: gzip 66.5KB → 33.4KB(半減)
- トップページの全CSS(gzip): 約162KB → 約129KB
- 修正前(canonical/global-error修正前)比では 約318KB → 約129KB で **59%削減**
- JSバンドル合計(gzip): 632.7KB(予算700KB内)。最大チャンクは recharts を含む 99.9KB(FAQページ専用)

## 2026-06 Animation CSS Migration + recharts Removal + Light CSP

### 変更内容

- **framer-motion 部分撤廃**: スクロール連動のワンショットフェード(Reveal/RevealStagger と直接 motion 使用の計11ファイル)を CSS transition + IntersectionObserver へ完全互換移行(`src/components/common/Reveal.tsx` を書き換え、API・イージング・遅延値は同一)。Gallery のマーキー、PostHeader/JourneyHero/RoadmapHero/GlobePromo のマウントアニメも CSS @keyframes 化。
- **LazyMotion 化**: 退場アニメ(AnimatePresence)・共有要素(layoutId)・FLIP(layout)を使う残留14ファイルは完全再現がCSSで不可能なため framer-motion を維持しつつ、`m.*` + `LazyMotion(domMax, strict)` に移行(`MotionProvider` を layout に追加)。今後 `motion.*` は使用禁止。
- **recharts 撤廃**: FAQ のドーナツ/横棒チャートを手書き SVG + CSS(`src/components/pages/faq/charts.tsx`)に置換し、依存から削除。ツールチップ・凡例・ホバー・マウントアニメは維持(ツールチップはマウス追従を自前実装)。
- **ライトCSP**: netlify.toml に `object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'` を追加。AdSense が許可リスト式CSPを公式サポートしないため script-src は制限しない方針(公式: nonce式 strict CSP のみサポート)。
- **Speed Index 対策(S1)**: Hero/WorldMap のローディング表示を「動き続けるアニメーション」から静的な世界地図シルエット(`WorldMapPlaceholder`)に変更。splitFlap の停止(S2)は演出維持のため見送り。
- next.config.ts に `NEXT_DIST_DIR` による distDir 切り替えを追加(Windows で .next がロックされた際の検証ビルド用)。

### 計測結果(ローカルビルド実測・gzip)

- 全JSチャンク合計: **632.7KB → 532KB(−100.7KB)**。recharts チャンク(99.9KB)が消滅。
- FAQページ参照JS: 117KB(recharts 参照ゼロを確認)。
- トップページ参照JS: 153KB(バイト数は不変。効果はハイドレーション削減側)。
- トップページCSS: 127KB(5ファイル)。セッション開始時 318KB から **60%削減**。
- ローカル Lighthouse はマシン負荷による分散が大きすぎ比較不能(TBT が同条件2連続で 4,750ms ↔ 9,310ms)。**本番デプロイ後に PageSpeed Insights で再計測すること**。

### 次に見ること

- デプロイ後 PSI: FCP/LCP/TBT/SI(基準: 2026-06-10 の FCP 7.7s / LCP 10.7s / TBT 770ms / SI 9.9s)
- AdSense 再審査前に docs/adsense-cleanup の A1記事28件の対応判断

## 2026-06-16 日本語フォント大幅削減(レンダリングブロックCSS / woff2 本数)

### 背景(PSI 指摘)

- レンダリングブロックCSS 推定削減 7,720ms、未使用CSS 88KiB(font CSS チャンク `16jn…`/`0y4l…`)、クリティカルチェーンに woff2 約50本。
- ビルド実測で原因を確定: **全CSS(raw)の 50.5% が `@font-face`、そのうち 97% が日本語2ファミリー(Noto Sans JP / Shippori Mincho)**。欧文フォント(Playfair/Montserrat/Caveat 計約5KB)・アプリCSS(Tailwind 185KB, font-face ゼロ)・レガシーJS 13KB(browserslist 既に除外、core-js 同梱の依存由来)・GTM は削りどころ薄く対象外。日本語 Web フォントは 1 ファミリー1ウェイトでも unicode-range 約100スライスで `@font-face` だけ 94KB raw という構造的な重さ。

### 変更内容

- **Noto Sans JP**: `weight: ["400","700"]` → `"400"`(本文の太字は合成ボールド化)。
- **Shippori Mincho を完全撤廃**: layout.tsx の定義・`--font-shippori-mincho` 変数・body className を削除。`.font-heading`(globals.css)を OS 明朝スタックへ: `var(--font-playfair-display), "Hiragino Mincho ProN", "Hiragino Mincho Pro", "Yu Mincho", "YuMincho", "Noto Serif JP", serif`。
  - 見出しの明朝は iPhone/Mac=ヒラギノ明朝、Windows=游明朝で維持。**Android のみ serif フォールバック(実質ゴシック)になる点はユーザー承認済み**。post タイトルは動的でサブセット化不可のためこの方式を選択。

### 計測結果(`NEXT_DIST_DIR=.next-perf` のローカル本番ビルド実測)

| | @font-face CSS(raw) | woff2(ビルド全体) |
|---|---|---|
| 開始時(Noto 400+700, Shippori 700) | 約289KB(JP3セット) | 約381本 / 約10.8MB |
| Noto 700 削除後 | 194,550 B(JP2セット) | 259本 / 6.99MB |
| **Shippori 削除後(最終)** | **約96KB(JP1セット)** | **137本 / 3.15MB(−3.84MB)** |

- 全CSS raw: 384,931 B(Noto 700削除時)→ 290,277 B(Shippori削除後)。Shippori のフォントCSSチャンク(94KB raw / ≒30KB gzip)が**ビルドから丸ごと消滅**。PSI 名指しの `0y4l…css` が消える。
- lint / typecheck パス。

### 次に見ること

- デプロイ後 PSI でレンダリングブロックCSS・未使用CSS・woff2 本数の改善を再計測。
- 見た目確認: Android 実機での見出し(ゴシックフォールバック)と、Win/Mac/iOS での明朝表示。
- さらに削るなら本文 Noto Sans JP 自体を OS フォント化する案もあるが、本文は全環境で確実なゴシックが必要なため現状維持が無難。
