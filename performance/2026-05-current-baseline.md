# Current Performance Baseline - 2026-05

## 対象

ともきちの旅行日記 / travel-diary

## Lighthouse / PageSpeed 計測

### Mobile

- Performance: 49
- Accessibility: 96
- Best Practices: 96
- SEO: 100
- FCP: 5.1s
- LCP: 7.7s
- TBT: 390ms
- CLS: 0
- Speed Index: 8.7s

### Desktop

- Performance: 73
- Accessibility: 96
- Best Practices: 96
- SEO: 100
- FCP: 1.0s
- LCP: 1.4s
- TBT: 360ms
- CLS: 0
- Speed Index: 2.3s

## 現時点の所感

表示そのものはギリギリ許容範囲だが、実際の不満は以下に出ている。

- スクロールが重い
- クリック後の反応が遅い
- ページ遷移開始までに待ちがある

そのため、今後はFCP/LCPだけでなく以下を重視する。

- TBT
- INP
- Long Task
- Main thread work
- Event click
- Layout
- Recalculate Style
- Evaluate Script

## 改善の優先度

1. 記事ページのクライアント境界を小さくする
2. `post.content` をクライアント境界に渡さない
3. SearchOverlayを遅延読み込みする
4. 外部scriptを遅延・条件付きロードにする
5. Backgroundをモバイルで軽量化する
6. GlobePromoを記事末尾で遅延読み込みする
7. TOCのDOMスキャンを減らす
8. アフィリエイトiframeを遅延生成する
9. 依存関係を棚卸しする
