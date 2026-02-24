"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { FocusMode, useFocusMode } from "./FocusModeContext";

const FOCUS_LEVEL_OPTIONS: {
  value: Extract<FocusMode, "minimal" | "standard" | "maximum">;
  label: string;
  description: string;
}[] = [
  {
    value: "minimal",
    label: "最小",
    description: "ヘッダー・フッター・目次を非表示",
  },
  {
    value: "standard",
    label: "標準",
    description: "読書に不要な要素を広く非表示",
  },
  {
    value: "maximum",
    label: "最大",
    description: "タイトルを残して本文中心",
  },
];

const PANEL_TRANSITION = {
  type: "spring",
  stiffness: 230,
  damping: 32,
  mass: 1,
} as const;

const FocusModeToggle = () => {
  const { focusMode, setFocusMode, isPostDetailPage, isFocusActive } =
    useFocusMode();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isPostDetailPage) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isPostDetailPage]);

  if (!isPostDetailPage) {
    return null;
  }

  const activeOption = FOCUS_LEVEL_OPTIONS.find((option) => option.value === focusMode);

  return (
    <motion.div
      ref={rootRef}
      className="fixed right-4 top-4 z-[80] sm:right-6 sm:top-6"
      initial={false}
      animate={{ y: isFocusActive ? 0 : 88 }}
      transition={{ type: "spring", stiffness: 220, damping: 30, mass: 1 }}
    >
      <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-background/90 p-2 shadow-xl backdrop-blur-md">
        <button
          type="button"
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
            isFocusActive
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-secondary/70 text-foreground hover:bg-secondary"
          )}
          onClick={() => {
            if (isFocusActive) {
              setFocusMode("off");
              setIsOpen(false);
              return;
            }
            setFocusMode("standard");
            setIsOpen(false);
          }}
          aria-label={isFocusActive ? "集中モードを終了" : "集中モードを開始"}
        >
          <Eye className="h-4 w-4" />
          <span>{isFocusActive ? "集中モードを解除" : "集中モードを開始"}</span>
        </button>

        <AnimatePresence initial={false}>
          {isFocusActive && (
            <motion.button
              type="button"
              initial={{ opacity: 0, width: 0, scale: 0.9 }}
              animate={{ opacity: 1, width: 40, scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.9 }}
              transition={PANEL_TRANSITION}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition-colors hover:bg-primary/15"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-label="集中モードのレベル設定"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {isFocusActive && (
          <motion.p
            key="focus-caption"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32 }}
            className="mt-2 rounded-lg bg-background/90 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur-sm"
          >
            現在: {activeOption?.label ?? "標準"} / 右のボタンでレベル変更
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isFocusActive && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={PANEL_TRANSITION}
            className="mt-3 w-72 overflow-hidden rounded-2xl border border-border/80 bg-background/95 p-2 shadow-2xl backdrop-blur-md"
          >
            {FOCUS_LEVEL_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setFocusMode(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full rounded-xl px-3 py-2 text-left transition-colors",
                  focusMode === option.value
                    ? "bg-primary/10 text-foreground"
                    : "hover:bg-muted"
                )}
              >
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FocusModeToggle;
