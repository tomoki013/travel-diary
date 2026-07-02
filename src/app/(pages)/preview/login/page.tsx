import { notFound } from "next/navigation";
import LoginClient from "./LoginClient";
import { isPreviewEnabled } from "@/lib/preview-mode";
import type { Metadata } from "next";

// 執筆用の内部ページ。検索エンジンにインデックスさせない。
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewLoginPage() {
  if (!isPreviewEnabled()) {
    notFound();
  }

  return <LoginClient />;
}
