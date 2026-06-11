"use client";

import { LazyMotion, domMax } from "framer-motion";

/**
 * framer-motion の機能セットを遅延読み込みする Provider。
 *
 * 各コンポーネントは `motion.*` ではなく `m.*` を使うこと(`strict` 指定により
 * `motion.*` をレンダリングすると開発時に例外で検知できる)。
 * `domMax` は layout / layoutId アニメーション(PhotoGrid, PhotoFilter,
 * CustomSelect)に必要。これらを使わなくなったら `domAnimation` へ
 * 切り替えるとさらに小さくなる。
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
