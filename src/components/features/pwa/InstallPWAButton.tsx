"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

interface InstallPWAButtonProps {
  className?: string;
}

export default function InstallPWAButton({ className }: InstallPWAButtonProps) {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
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
