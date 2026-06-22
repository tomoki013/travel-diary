"use client";

import { PostMetadata } from "@/types/types";
import CopyLinkButton from "@/components/common/share-buttons/CopyLinkButton";
import NativeShareButton from "@/components/common/share-buttons/NativeShareButton";

interface Props {
  post: PostMetadata;
  url?: string;
}

const ShareButtons = ({ post, url }: Props) => {
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  if (!currentUrl) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
      <span className="font-semibold">Share:</span>
      {/* OS の共有シート（モバイル等、対応環境のみ表示）とコピーのみを提供する */}
      <NativeShareButton url={currentUrl} title={post.title} text={post.excerpt || ""} />
      <CopyLinkButton url={currentUrl} />
    </div>
  );
};

export default ShareButtons;
