import styles from "./PageLoader.module.css";

interface PageLoaderProps {
  /** ローディング中に表示するメッセージ */
  message?: string;
}

// 外周ダイヤルの方位ティック（30度刻み）
const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

/**
 * フルスクリーンのページ遷移ローディング（loading.tsx 専用）。
 * 方位を探すコンパスのモチーフ。針が振れて落ち着く動きを繰り返す。
 * フックを持たないためサーバーコンポーネントのまま利用できる。
 */
export const PageLoader = ({ message = "ページを準備しています…" }: PageLoaderProps) => {
  return (
    <div className={styles.root} role="status" aria-live="polite">
      <div className={styles.compass} aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none">
          {/* 外周ダイヤル（ゆっくり回転） */}
          <g className={styles.dial}>
            <circle className={styles.rim} cx="60" cy="60" r="52" />
            {TICKS.map((deg) => {
              const isCardinal = deg % 90 === 0;
              return (
                <line
                  key={deg}
                  className={isCardinal ? styles.tickMajor : styles.tick}
                  x1="60"
                  y1="9"
                  x2="60"
                  y2={isCardinal ? 19 : 14}
                  transform={`rotate(${deg} 60 60)`}
                />
              );
            })}
          </g>

          {/* コンパス針（北=濃色 / 南=淡色） */}
          <g className={styles.needle}>
            <polygon className={styles.north} points="60,20 66,60 54,60" />
            <polygon className={styles.south} points="60,100 66,60 54,60" />
          </g>
          <circle className={styles.hub} cx="60" cy="60" r="4.5" />
        </svg>
      </div>

      <p className={styles.message}>{message}</p>
    </div>
  );
};
