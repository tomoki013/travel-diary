"use client";

import "./globals.css";
import { useEffect } from "react";
import ErrorDisplay from "@/components/common/ErrorDisplay";

// NOTE: ここで next/font を読み込んではいけない。
// global-error はルートレイアウトとは別エントリのため、ここでフォントを
// 定義するとレイアウト側と重複した @font-face CSS(日本語フォントで
// 数百KB)が全ページのクリティカルパスに含まれてしまう。
// エラー画面は globals.css のフォールバック(システムフォント)で表示する。
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ja">
      <body className="antialiased">
        <ErrorDisplay reset={reset} />
      </body>
    </html>
  );
}
