import styles from "./PageLoader.module.css";

// 航路の曲線（dotted ガイド・描画トレイル・飛行機の offset-path で共有）。
const FLIGHT_PATH = "M20,120 C90,120 150,55 280,28";

interface PageLoaderProps {
  /** 中央に出すサイト名 */
  title?: string;
  /** その下のタグライン */
  tagline?: string;
  /** サイト名・タグラインを表示するか。初回ロードのスプラッシュは true、
   *  ページ遷移（loading.tsx）は false にして飛行機の航路だけを出す。 */
  showText?: boolean;
}

/**
 * フルスクリーンのローディング。飛行機が航路（大圏コース）を描きながら目的地へ向かう演出。
 * `showText` が true のときだけサイト名とタグラインが下からせり上がる。
 * 色・雰囲気はサイトのアンバー基調＋テーマトークンに合わせている。
 * フックを持たないためサーバーコンポーネントのまま利用できる。
 */
export const PageLoader = ({
  title = "ともきちの旅行日記",
  tagline = "一生モノの体験を、もっと身近に。",
  showText = true,
}: PageLoaderProps) => {
  return (
    <div className={styles.root} role="status" aria-live="polite">
      <div className={styles.flight}>
        <svg className={styles.svg} viewBox="0 0 300 150" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="pl-trail" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#d6d3d1" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* 航路のガイド（点線・地図感） */}
          <path className={styles.guide} d={FLIGHT_PATH} />
          {/* 描かれていくトレイル */}
          <path className={styles.trail} d={FLIGHT_PATH} pathLength={350} />

          {/* 出発地・到着地マーカー */}
          <circle className={styles.markerStart} cx="20" cy="120" r="4" />
          <circle className={styles.endGlow} cx="280" cy="28" r="11" />
          <circle className={styles.endDot} cx="280" cy="28" r="4.5" />

          {/* 航路上を進む飛行機（offset-path で曲線追従） */}
          <g className={styles.plane}>
            <path className={styles.planeBody} d="M-8,-5 L9,0 L-8,5 L-3,0 Z" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className={styles.text}>
          <span className={styles.mask}>
            <span className={`font-heading ${styles.title}`}>{title}</span>
          </span>
          <span className={styles.mask}>
            <span className={styles.tagline}>{tagline}</span>
          </span>
        </div>
      )}
    </div>
  );
};
