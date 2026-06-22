import type { CSSProperties } from "react";
import styles from "./LoadingAnimation.module.css";

interface LoadingAnimationProps {
  className?: string;
  /** スクリーンリーダー向けラベル（任意で表示テキストにもなる） */
  label?: string;
  /** ラベルを視覚的にも表示するか（false ならアニメーションのみ＋sr-only） */
  showLabel?: boolean;
  /** 直径(px) */
  size?: number;
}

/**
 * インライン共通ローディング（destination の世界地図 / ヘッダー検索などで使用）。
 * 中心から波紋が広がるソナー（位置ピング）モチーフ。CSS transform / opacity のみで軽量。
 * フルスクリーンのページ遷移ローディングは別物の PageLoader を使うこと。
 */
export const LoadingAnimation = ({
  className = "",
  label = "読み込んでいます",
  showLabel = false,
  size = 88,
}: LoadingAnimationProps) => {
  return (
    <div
      className={`${styles.wrap} ${className}`}
      role="status"
      aria-live="polite"
      style={{ "--size": `${size}px` } as CSSProperties}
    >
      <div className={styles.sonar} aria-hidden="true">
        <span className={`${styles.ping} ${styles.p1}`} />
        <span className={`${styles.ping} ${styles.p2}`} />
        <span className={`${styles.ping} ${styles.p3}`} />
        <span className={styles.dot} />
      </div>
      {showLabel ? (
        <p className={styles.label}>{label}</p>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
};
