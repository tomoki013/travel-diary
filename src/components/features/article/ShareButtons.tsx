"use client";

import { PostMetadata } from "@/types/types";
import CopyLinkButton from "@/components/common/share-buttons/CopyLinkButton";
import NativeShareButton from "@/components/common/share-buttons/NativeShareButton";

interface Props {
  post: PostMetadata;
  url?: string;
}

// 共有は OS の共有シート(対応環境のみ表示)とリンクコピーの2つに絞る。
// SNS 個別ボタン(X/Facebook/LINE)は 2026-07 に撤去(OS シート経由で共有可能なため)
const ShareButtons = ({ post, url }: Props) => {
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  if (!currentUrl) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <NativeShareButton url={currentUrl} title={post.title} text={post.excerpt || ""} />
      <CopyLinkButton url={currentUrl} />
    </div>
  );
};

export default ShareButtons;
