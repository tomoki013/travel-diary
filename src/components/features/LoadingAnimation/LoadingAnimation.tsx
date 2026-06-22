import type { CSSProperties } from "react";
import styles from "./LoadingAnimation.module.css";

interface LoadingAnimationProps {
  className?: string;
  /** スクリーンリーダー向けラベル（任意で表示テキストにもなる） */
  label?: string;
  /** ラベルを視覚的にも表示するか（false ならアニメーションのみ＋sr-only） */
  showLabel?: boolean;
  /** 横幅(px) */
  size?: number;
}

/**
 * 通常のローディング（destination の世界地図 / ヘッダー検索などインラインで使用）。
 * やわらかいパステルの熱気球がふわりと浮かぶ情景（サイトのヒーロー＝カッパドキアの
 * 気球に呼応）。フルスクリーンのページ遷移ローディングは別物の PageLoader を使うこと。
 */
export const LoadingAnimation = ({
  className = "",
  label = "読み込んでいます",
  showLabel = false,
  size = 200,
}: LoadingAnimationProps) => {
  return (
    <div
      className={`${styles.wrap} ${className}`}
      role="status"
      aria-live="polite"
      style={{ "--size": `${size}px` } as CSSProperties}
    >
      <svg className={styles.scene} viewBox="0 0 240 160" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="la-peach" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fecdd3" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
          <linearGradient id="la-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="la-amber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <radialGradient id="la-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* やわらかな陽だまり */}
        <circle cx="42" cy="36" r="30" fill="url(#la-sun)" />

        {/* きらめき */}
        <g fill="#fcd34d">
          <circle className={`${styles.sparkle} ${styles.sp1}`} cx="30" cy="58" r="1.5" />
          <circle className={`${styles.sparkle} ${styles.sp2}`} cx="206" cy="50" r="1.5" />
          <circle className={`${styles.sparkle} ${styles.sp3}`} cx="100" cy="30" r="1.2" />
          <circle className={`${styles.sparkle} ${styles.sp4}`} cx="178" cy="78" r="1.3" />
          <circle className={`${styles.sparkle} ${styles.sp5}`} cx="56" cy="92" r="1.2" />
        </g>

        {/* 遠くを渡る鳥 */}
        <g
          className={`${styles.bird} ${styles.bird1}`}
          stroke="#78716c"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M0,0 Q2.5,-2.6 5,0" />
          <path d="M5,0 Q7.5,-2.6 10,0" />
        </g>
        <g
          className={`${styles.bird} ${styles.bird2}`}
          stroke="#78716c"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M0,0 Q2,-2 4,0" />
          <path d="M4,0 Q6,-2 8,0" />
        </g>

        {/* 流れる雲 */}
        <g className={`${styles.cloud} ${styles.cloud1}`} fill="#ffffff" opacity="0.7">
          <circle cx="36" cy="118" r="9" />
          <circle cx="48" cy="118" r="12" />
          <circle cx="62" cy="120" r="8" />
        </g>
        <g className={`${styles.cloud} ${styles.cloud2}`} fill="#ffffff" opacity="0.55">
          <circle cx="182" cy="128" r="8" />
          <circle cx="194" cy="126" r="11" />
          <circle cx="206" cy="129" r="7" />
        </g>

        {/* 熱気球（位置は外側 <g>、ふわふわアニメは内側 <g> で分離） */}
        <g transform="translate(116 88) scale(1.05)">
          <g className={`${styles.balloon} ${styles.balloonA}`}>
            <BalloonShape fill="url(#la-peach)" />
          </g>
        </g>
        <g transform="translate(172 70) scale(0.8)">
          <g className={`${styles.balloon} ${styles.balloonB}`}>
            <BalloonShape fill="url(#la-sky)" />
          </g>
        </g>
        <g transform="translate(64 74) scale(0.64)">
          <g className={`${styles.balloon} ${styles.balloonC}`}>
            <BalloonShape fill="url(#la-amber)" />
          </g>
        </g>
      </svg>

      {showLabel ? (
        <p className={styles.message}>{label}</p>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
};

/** 1 つの熱気球（原点中心。上が気球、下にバスケットが吊り下がる） */
const BalloonShape = ({ fill }: { fill: string }) => (
  <g>
    <path
      d="M0,-16 C9,-16 14,-9 14,-2 C14,7 6,13 0,20 C-6,13 -14,7 -14,-2 C-14,-9 -9,-16 0,-16 Z"
      fill={fill}
    />
    {/* 光沢ハイライト */}
    <ellipse
      cx="-4.5"
      cy="-7"
      rx="3"
      ry="4.6"
      fill="#ffffff"
      opacity="0.32"
      transform="rotate(-20 -4.5 -7)"
    />
    <g stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.8" fill="none">
      <path d="M-7,-15 C-11,-8 -11,8 0,20" />
      <path d="M0,-16 L0,20" />
      <path d="M7,-15 C11,-8 11,8 0,20" />
    </g>
    <line x1="-6" y1="15" x2="-3" y2="24" stroke="#9a8478" strokeWidth="0.7" />
    <line x1="6" y1="15" x2="3" y2="24" stroke="#9a8478" strokeWidth="0.7" />
    <rect x="-3" y="24" width="6" height="5" rx="1.2" fill="#b08968" />
  </g>
);
