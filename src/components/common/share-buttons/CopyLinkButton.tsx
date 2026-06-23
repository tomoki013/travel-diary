"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

interface Props {
  url: string;
}

const CopyLinkButton = ({ url }: Props) => {
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("クリップボードにコピーしました");
    });
  };

  return (
    <button
      onClick={copyUrlToClipboard}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-600 shadow-sm ring-1 ring-stone-200 transition-all hover:-translate-y-0.5 hover:bg-amber-600 hover:text-white hover:shadow-md hover:ring-amber-600 dark:bg-stone-900 dark:text-stone-300 dark:ring-stone-800 dark:hover:bg-amber-600 dark:hover:text-white"
      aria-label="リンクをコピー"
    >
      <Copy size={18} />
    </button>
  );
};

export default CopyLinkButton;
