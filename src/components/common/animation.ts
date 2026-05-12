import { Variants, Transition } from "framer-motion";

/**
 * アプリケーション全体で一貫したアニメーションを提供するための基本設定
 */
const defaultTransition: Transition = {
  duration: 0.6,
  ease: [0.43, 0.13, 0.23, 0.96] as const, // 変更点: as const を追加してタプル型に
};

// --- 汎用アニメーションビルダー ---

/**
 * 指定された方向からスライドしながらフェードインするアニメーションを生成します。
 * @param direction - アニメーションの方向 ('up' | 'down' | 'left' | 'right')
 * @param distance - 初期位置のオフセット距離 (px)
 * @param delay - アニメーション開始までの遅延時間 (s)
 * @returns {Variants} - Framer Motion用のVariantsオブジェクト
 */
export const slideFadeIn = (
  direction: "up" | "down" | "left" | "right" = "up",
  distance: number = 30,
  delay: number = 0,
): Variants => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -distance : direction === "right" ? distance : 0,
    y: direction === "up" ? distance : direction === "down" ? -distance : 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      ...defaultTransition,
      delay,
    },
  },
});

/**
 * シンプルなフェードインアニメーションを生成します。
 * @param duration - アニメーションの継続時間 (s)
 * @param delay - アニメーション開始までの遅延時間 (s)
 * @returns {Variants} - Framer Motion用のVariantsオブジェクト
 */
export const fadeIn = (duration: number = 0.5, delay: number = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  },
});

/**
 * 子要素を順番にアニメーションさせるための親コンテナ用Variantsを生成します。
 * @param staggerChildren - 子要素間のアニメーション遅延時間 (s)
 * @param delayChildren - 最初の子要素がアニメーションを開始するまでの遅延時間 (s)
 * @returns {Variants} - Framer Motion用のVariantsオブジェクト
 */
export const staggerContainer = (
  staggerChildren: number = 0.1,
  delayChildren: number = 0,
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// --- 事前定義済みVariants ---

/**
 * ページセクション全体が大きく下からフェードインするアニメーション。
 */
export const sectionVariants: Variants = slideFadeIn("up", 50, 0);

/**
 * モーダル表示に関連するアニメーションのセット。
 * AnimatePresenceと組み合わせて使用します。
 */
export const modal = {
  /**
   * 背景オーバーレイのフェードイン・アウト
   */
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  } as Variants,

  /**
   * コンテンツ部分のスケール＆フェードアニメーション
   */
  content: {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: defaultTransition.ease,
      },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const, // 変更点: as const を追加してタプル型に
      },
    },
  } as Variants,
};
