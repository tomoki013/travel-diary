# Performance Checklist

## 毎回見る

- [ ] Mobile Lighthouse
- [ ] Desktop Lighthouse
- [ ] TBT
- [ ] CLS
- [ ] LCP element
- [ ] Network dependency tree
- [ ] Render-blocking requests
- [ ] Unused CSS
- [ ] Unused JavaScript
- [ ] Main-thread work
- [ ] Third-party scripts
- [ ] Forced reflow
- [ ] DevTools Performance recording
- [ ] 実機またはCPU slowdownでスクロール確認
- [ ] リンククリック後の遷移開始確認

## 実装時に注意する

- [ ] クライアントコンポーネントを広げすぎない
- [ ] 記事本文をクライアント境界に渡さない
- [ ] 外部scriptを全ページで即時読み込みしない
- [ ] iframeを初期表示で大量生成しない
- [ ] 無限アニメーションをモバイルで増やしすぎない
- [ ] Webフォントを増やしすぎない
- [ ] `next/image` に適切な `sizes` を入れる
- [ ] LCP画像には `priority` / `fetchPriority` を検討する
- [ ] 収益導線を消さずに遅延する
