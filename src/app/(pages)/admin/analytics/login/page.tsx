import { notFound } from "next/navigation";
import LoginClient from "./LoginClient";
import type { Metadata } from "next";

// 運営者用の内部ページ。検索エンジンにインデックスさせない。
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// ANALYTICS_PASSWORD を評価するためリクエスト時レンダリングにする
export const dynamic = "force-dynamic";

export default function AnalyticsLoginPage() {
  // パスワード未設定の環境ではページごと存在しない扱いにする
  if (!process.env.ANALYTICS_PASSWORD) {
    notFound();
  }

  return <LoginClient />;
}
