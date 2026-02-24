"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

export type FocusMode = "off" | "minimal" | "standard" | "maximum";

type FocusModeContextValue = {
  focusMode: FocusMode;
  setFocusMode: (mode: FocusMode) => void;
  isFocusActive: boolean;
  isPostDetailPage: boolean;
};

const FocusModeContext = createContext<FocusModeContextValue | null>(null);

const isPostDetailPath = (pathname: string | null): boolean => {
  if (!pathname) return false;
  const segments = pathname.split("/").filter(Boolean);
  return segments.length === 2 && segments[0] === "posts";
};

// 記事内の要素を特定するためのセレクタ
const CONTENT_SELECTOR = "article h2, article h3, article p, article li, article img";

export const FocusModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [focusMode, setFocusModeState] = useState<FocusMode>("off");
  const isPostDetailPage = isPostDetailPath(pathname);

  // スクロール位置保持のためのアンカー情報
  const [anchor, setAnchor] = useState<{
    selector: string;
    index: number;
    offset: number;
  } | null>(null);

  const setFocusMode = useCallback((mode: FocusMode) => {
    // 状態変更前に、現在のビューポート内にある基準となる要素（アンカー）を特定する
    const elements = document.querySelectorAll(CONTENT_SELECTOR);
    let bestIndex = -1;
    let bestOffset = 0;

    // ビューポートの上端に近い要素を探す
    for (let i = 0; i < elements.length; i++) {
        const rect = elements[i].getBoundingClientRect();
        // 上端がビューポート内（0以上）にある最初の要素を採用
        // ヘッダー分のマージンを考慮して少し余裕を持たせる（例: 0〜）
        if (rect.top >= 0) {
            bestIndex = i;
            bestOffset = rect.top;
            break;
        }
    }

    // もし全ての要素の上端がビューポートより上にある場合（長いパラグラフの途中など）
    if (bestIndex === -1 && elements.length > 0) {
         for (let i = 0; i < elements.length; i++) {
             const rect = elements[i].getBoundingClientRect();
             // 底辺がビューポート内にある（＝現在表示されている）要素を採用
             if (rect.bottom > 0) {
                 bestIndex = i;
                 bestOffset = rect.top;
                 break;
             }
         }
    }

    if (bestIndex !== -1) {
        setAnchor({ selector: CONTENT_SELECTOR, index: bestIndex, offset: bestOffset });
    }

    setFocusModeState(mode);
  }, []);

  // レイアウト変更（アニメーション含む）に合わせてスクロール位置を調整し続ける
  useLayoutEffect(() => {
    if (!anchor) return;

    const startTime = performance.now();
    // transition duration (700ms) + buffer
    const duration = 1000;

    const loop = () => {
      const now = performance.now();
      if (now - startTime > duration) {
        setAnchor(null); // アニメーション終了後はアンカーを解除
        return;
      }

      const elements = document.querySelectorAll(anchor.selector);
      const element = elements[anchor.index];

      if (element) {
          const rect = element.getBoundingClientRect();
          const currentTop = rect.top;
          const diff = currentTop - anchor.offset;

          // ズレがあれば補正する
          if (Math.abs(diff) > 1) {
             window.scrollBy(0, diff);
          }
      }

      requestAnimationFrame(loop);
    };

    const animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [focusMode, anchor]);

  const value = useMemo<FocusModeContextValue>(
    () => ({
      focusMode: isPostDetailPage ? focusMode : "off",
      setFocusMode,
      isFocusActive: isPostDetailPage && focusMode !== "off",
      isPostDetailPage,
    }),
    [focusMode, isPostDetailPage, setFocusMode]
  );

  return (
    <FocusModeContext.Provider value={value}>
      {children}
    </FocusModeContext.Provider>
  );
};

export const useFocusMode = (): FocusModeContextValue => {
  const context = useContext(FocusModeContext);
  if (!context) {
    throw new Error("useFocusMode must be used within FocusModeProvider");
  }
  return context;
};
