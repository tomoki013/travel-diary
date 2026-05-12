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
      className="text-foreground bg-primary-foreground relative rounded-full p-3 transition-colors hover:bg-gray-200"
      aria-label="Copy link"
    >
      <Copy size={20} />
    </button>
  );
};

export default CopyLinkButton;
