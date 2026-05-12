# Performance Checklist

## 毎回見る

- [ ] Mobile Lighthouse
- [ ] Desktop Lighthouse
- [ ] TBT
- [ ] CLS
- [ ] LCP element
- [ ] Network dependency tree
- [ ] Main-thread work
- [ ] Third-party scripts
- [ ] DevTools Performance recording
- [ ] 実機またはCPU slowdownでスクロール確認
- [ ] リンククリック後の遷移開始確認

## 実装時に注意する

- [ ] クライアントコンポーネントを広げすぎない
- [ ] 記事本文をクライアント境界に渡さない
- [ ] 外部scriptを全ページで即時読み込みしない
- [ ] iframeを初期表示で大量生成しない
- [ ] 無限アニメーションをモバイルで増やしすぎない
- [ ] 収益導線を消さずに遅延する
