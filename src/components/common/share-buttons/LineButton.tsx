"use client";

import { FaLine } from "react-icons/fa";

interface Props {
  url: string;
  title: string;
}

const LineButton = ({ url, title }: Props) => {
  const shareOnLine = () => {
    // 新しい LINE 共有形式 (line.me/R/share)。旧 lineit/share は非推奨。
    const text = encodeURIComponent(`${title}\n${url}`);
    window.open(`https://line.me/R/share?text=${text}`);
  };

  return (
    <button
      onClick={shareOnLine}
      className="text-foreground bg-primary-foreground rounded-full p-3 transition-colors hover:bg-gray-200"
      aria-label="Share on LINE"
    >
      <FaLine size={20} />
    </button>
  );
};

export default LineButton;
