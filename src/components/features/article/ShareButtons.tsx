"use client";

import { PostMetadata } from "@/types/types";
import CopyLinkButton from "@/components/common/share-buttons/CopyLinkButton";
import NativeShareButton from "@/components/common/share-buttons/NativeShareButton";
import { FaXTwitter, FaFacebookF, FaLine } from "react-icons/fa6";

interface Props {
  post: PostMetadata;
  url?: string;
}

// 共有ボタン共通のベーススタイル(stone ベース + ホバーで各サービス色に着色)
const baseClass =
  "flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-600 shadow-sm ring-1 ring-stone-200 transition-all hover:-translate-y-0.5 hover:text-white hover:shadow-md dark:bg-stone-900 dark:text-stone-300 dark:ring-stone-800";

const ShareButtons = ({ post, url }: Props) => {
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  if (!currentUrl) {
    return null;
  }

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(post.title);

  const socials = [
    {
      name: "X",
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <FaXTwitter size={18} />,
      hover:
        "hover:bg-stone-900 hover:ring-stone-900 dark:hover:bg-stone-100 dark:hover:text-stone-900 dark:hover:ring-stone-100",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FaFacebookF size={18} />,
      hover: "hover:bg-[#1877F2] hover:ring-[#1877F2] dark:hover:bg-[#1877F2]",
    },
    {
      name: "LINE",
      href: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
      icon: <FaLine size={20} />,
      hover: "hover:bg-[#06C755] hover:ring-[#06C755] dark:hover:bg-[#06C755]",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${s.name}でシェア`}
          className={`${baseClass} ${s.hover}`}
        >
          {s.icon}
        </a>
      ))}
      {/* OS の共有シート(モバイル等、対応環境のみ表示)とコピー */}
      <NativeShareButton url={currentUrl} title={post.title} text={post.excerpt || ""} />
      <CopyLinkButton url={currentUrl} />
    </div>
  );
};

export default ShareButtons;
