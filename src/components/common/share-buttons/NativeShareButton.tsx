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
  const isSupported = hydrated && typeof navigator !== "undefined" && "share" in navigator;

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
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-600 shadow-sm ring-1 ring-stone-200 transition-all hover:-translate-y-0.5 hover:bg-amber-600 hover:text-white hover:shadow-md hover:ring-amber-600 dark:bg-stone-900 dark:text-stone-300 dark:ring-stone-800 dark:hover:bg-amber-600 dark:hover:text-white"
      aria-label="共有"
    >
      <FiShare size={18} />
    </button>
  );
};

export default NativeShareButton;
