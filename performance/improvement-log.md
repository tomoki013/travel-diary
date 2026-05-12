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
