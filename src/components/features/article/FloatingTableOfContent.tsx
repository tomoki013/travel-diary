"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "lucide-react";
import {
  TableOfContentNav,
  useArticleHeadings,
} from "@/components/features/article/TableOfContent";

const SCROLL_TRIGGER_OFFSET = 120;

const FloatingTableOfContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const { headings, activeId } = useArticleHeadings(true, navRef);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > SCROLL_TRIGGER_OFFSET;

      setIsVisible(shouldShow);
      if (!shouldShow) {
        setIsOpen(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.button
            type="button"
            aria-label="目次を開く"
            aria-expanded={isOpen}
            aria-controls="floating-table-of-content"
            className="fixed bottom-6 right-4 z-[70] inline-flex h-14 items-center gap-2 rounded-full border border-amber-200 bg-stone-950 px-5 text-sm font-bold text-amber-50 shadow-2xl shadow-stone-950/20 ring-1 ring-white/20 transition-colors hover:bg-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-amber-500/30 dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400 sm:right-6"
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={() => setIsOpen(true)}
          >
            <List className="h-5 w-5" strokeWidth={2.5} />
            <span>目次</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center px-3 pb-3 sm:px-6 sm:pb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="目次を閉じる"
              className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              id="floating-table-of-content"
              role="dialog"
              aria-modal="true"
              aria-labelledby="floating-table-of-content-title"
              className="relative max-h-[75vh] w-full max-w-2xl overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-950"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-stone-100 px-5 py-4 dark:border-stone-800 sm:px-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-400">
                    Table of Contents
                  </p>
                  <h2
                    id="floating-table-of-content-title"
                    className="mt-1 font-heading text-xl font-bold text-stone-900 dark:text-stone-50"
                  >
                    目次から移動
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="目次を閉じる"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[calc(75vh-5.75rem)] overflow-y-auto">
                <TableOfContentNav
                  headings={headings}
                  activeId={activeId}
                  navRef={navRef}
                  onHeadingClick={() => setIsOpen(false)}
                  className="border-t-0 bg-transparent"
                  listClassName="sm:grid-cols-1"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingTableOfContent;
