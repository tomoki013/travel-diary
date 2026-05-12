"use client";

import { FaFacebook } from "react-icons/fa";

interface Props {
  url: string;
}

const FacebookButton = ({ url }: Props) => {
  const shareOnFacebook = () => {
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`);
  };

  return (
    <button
      onClick={shareOnFacebook}
      className="text-foreground bg-primary-foreground rounded-full p-3 transition-colors hover:bg-gray-200"
      aria-label="Share on Facebook"
    >
      <FaFacebook size={20} />
    </button>
  );
};

export default FacebookButton;
