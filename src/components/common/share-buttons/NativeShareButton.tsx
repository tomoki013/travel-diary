"use client";

import { FiShare } from "react-icons/fi";
import { useHydrated } from "@/hooks/useHydrated";

interface Props {
  url: string;
  title: string;
  text: string;
}

const NativeShareButton = ({ url, title, text }: Props) => {
  const hydrated = useHydrated();
  const isSupported =
    hydrated && typeof navigator !== "undefined" && "share" in navigator;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={handleShare}
      className="p-3 rounded-full text-foreground bg-primary-foreground hover:bg-gray-200 transition-colors"
      aria-label="Share"
    >
      <FiShare size={20} />
    </button>
  );
};

export default NativeShareButton;
