"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { FocusMode, useFocusMode } from "./FocusModeContext";
import { useUI } from "@/context/UIContext";

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
  const { isMobileMenuOpen, isSearchOpen } = useUI();
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.matchMedia("(min-width: 640px)").matches);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    // 3秒後にヒント（テキストラベル）を非表示にする
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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

  // モーダルやメニューが開いているときは非表示にする
  if (!isPostDetailPage || isMobileMenuOpen || isSearchOpen) {
    return null;
  }

  const activeOption = FOCUS_LEVEL_OPTIONS.find((option) => option.value === focusMode);

  return (
    <motion.div
      ref={rootRef}
      className="fixed right-4 bottom-4 z-[120] flex flex-col-reverse items-end gap-2 sm:top-6 sm:bottom-auto sm:block"
      initial={false}
      animate={{ y: isDesktop ? (isFocusActive ? 0 : 88) : 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 30, mass: 1 }}
    >
      <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-background/90 p-2 shadow-xl backdrop-blur-md transition-opacity duration-300 hover:opacity-100 sm:opacity-100 opacity-80">
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300",
            // モバイル時のスタイル（ヒント表示中 or 常に表示の設定なら広げる、それ以外は丸ボタン）
            showHint ? "h-10 px-4 rounded-xl" : "h-10 w-10 rounded-full",
            // デスクトップ(sm以上)は常にテキストあり
            "sm:w-auto sm:px-4 sm:rounded-xl sm:h-10",
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
          <Eye className="h-4 w-4 flex-shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap overflow-hidden transition-all duration-300",
              showHint ? "max-w-[100px] opacity-100" : "max-w-0 opacity-0",
              "sm:max-w-[100px] sm:opacity-100"
            )}
          >
            {isFocusActive ? "集中モードを解除" : "集中モードを開始"}
          </span>
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
            className="rounded-lg bg-background/90 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur-sm sm:mt-2"
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
            className="w-72 overflow-hidden rounded-2xl border border-border/80 bg-background/95 p-2 shadow-2xl backdrop-blur-md sm:mt-3"
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
