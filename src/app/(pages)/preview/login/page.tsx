import { notFound } from "next/navigation";
import LoginClient from "./LoginClient";
import { isPreviewEnabled } from "@/lib/preview-mode";

export default function PreviewLoginPage() {
  if (!isPreviewEnabled()) {
    notFound();
  }

  return <LoginClient />;
}
