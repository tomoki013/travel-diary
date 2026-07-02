"use client";

import { useEffect, useState } from "react";
import { PageLoader } from "@/components/features/LoadingAnimation/PageLoader";
import styles from "./InitialPreloader.module.css";

// 退場（スライドアップ）にかける時間。CSS の transition と一致させること。
const EXIT_MS = 1000;
// エントランス演出を見せる最低表示時間。
// NOTE: フルスクリーンでコンテンツを隠すため、長くするほど体感速度と
// LCP を悪化させる。演出は維持しつつ待ち時間は最小限にする。
const MIN_VISIBLE_MS = 1200;
// load が発火しない等の保険として、最大でこの時間で退場を始める。
const MAX_VISIBLE_MS = 4500;

/**
 * 初回ロード／リロード時だけ表示するフルスクリーンのスプラッシュ。
 * ルートレイアウトに常駐するが、ページ遷移ではルートレイアウトが再マウントされないため
 * 一度退場したら再表示されない（遷移時のローディングは loading.tsx が担当）。
 * window の load 後（最低表示時間を満たしてから）スライドアップで退場する。
 */
export const InitialPreloader = () => {
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const begin = performance.now();
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    let finished = false;

    const beginExit = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - begin));
      exitTimer = setTimeout(() => setExiting(true), wait);
    };

    if (document.readyState === "complete") {
      beginExit();
    } else {
      window.addEventListener("load", beginExit, { once: true });
    }
    const maxTimer = setTimeout(beginExit, MAX_VISIBLE_MS);

    return () => {
      window.removeEventListener("load", beginExit);
      clearTimeout(maxTimer);
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(() => setGone(true), EXIT_MS);
    return () => clearTimeout(t);
  }, [exiting]);

  if (gone) return null;

  return (
    <div
      className={`${styles.preloader} ${exiting ? styles.exit : ""}`}
      role="status"
      aria-live="polite"
      aria-hidden={exiting}
    >
      <PageLoader />
    </div>
  );
};

export default InitialPreloader;
