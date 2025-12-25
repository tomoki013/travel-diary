"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstallPWAButtonProps {
  className?: string;
}

export default function InstallPWAButton({ className }: InstallPWAButtonProps) {
  const [promptEvent, setPromptEvent] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setPromptEvent(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  if (!promptEvent) return null;

  return (
    <Button
      variant="outline"
      className={cn("gap-2 shadow-sm font-code font-bold", className)}
      onClick={() => {
        promptEvent.prompt();
      }}
    >
      <Download className="size-4" />
      アプリをインストール
    </Button>
  );
}
