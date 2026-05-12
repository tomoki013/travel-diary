"use client";

import { FaLine } from "react-icons/fa";

interface Props {
  url: string;
  title: string;
}

const LineButton = ({ url, title }: Props) => {
  const shareOnLine = () => {
    const text = encodeURIComponent(title);
    const shareUrl = encodeURIComponent(url);
    window.open(`https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${text}`);
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
