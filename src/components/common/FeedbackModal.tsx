"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  useBodyScrollLock(isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-6 mx-4 bg-background rounded-lg shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">閉じる</span>
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            フィードバックにご協力ください
          </h2>
          <p className="text-muted-foreground mb-6">
            このAI旅行プランナーはまだ開発中です。
            <br />
            「こんな機能が欲しい」「ここが使いにくい」など、皆様のご意見が今後の改善の大きな助けとなります。
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/contact" onClick={onClose}>
                フィードバックを送る
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={onClose}>
              閉じる
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
