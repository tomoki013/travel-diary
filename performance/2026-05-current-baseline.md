# Current Performance Baseline - 2026-05

## 対象

ともきちの旅行日記 / travel-diary

## Lighthouse / PageSpeed 計測

### Mobile

- Performance: 41
- Accessibility: 96
- Best Practices: 96
- SEO: 100
- FCP: 5.1s
- LCP: 8.0s
- TBT: 740ms
- CLS: 0
- Speed Index: 7.6s

### 以前のMobile計測

- Performance: 49
- FCP: 5.1s
- LCP: 7.7s
- TBT: 390ms
- CLS: 0
- Speed Index: 8.7s

### Desktop

- Performance: 63
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
- Forced reflow

## PageSpeedで確認された主な問題

- Render-blocking CSS estimated savings: 6,400ms
- Unused CSS: 83.8KiB
- First-party JS total CPU: 4,402ms
- Main-thread work: 4.9s
- Unused JavaScript: 107KiB
- Forced reflowあり
- LCP画像に `fetchpriority=high` が必要
- 大量の `.woff2` がクリティカルパスに乗っている
