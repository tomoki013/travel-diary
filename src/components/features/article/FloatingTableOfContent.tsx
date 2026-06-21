"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { List, X } from "lucide-react";
import {
  TableOfContentNav,
  useHeadings,
  useScrollSync,
  type ArticleHeading,
} from "@/components/features/article/TableOfContent";

interface FloatingTableOfContentProps {
  headings?: ArticleHeading[];
  activeId?: string;
}

const FloatingTableOfContent = ({
  headings: propHeadings,
  activeId: propActiveId,
}: FloatingTableOfContentProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const localHeadings = useHeadings(!propHeadings);
  const headings = propHeadings ?? localHeadings;

  const localActiveId = useScrollSync(
    headings,
    isVisible && !propActiveId,
    navRef,
    true, // OK to scroll into view for floating TOC menu
  );

  const activeId = propActiveId ?? localActiveId;

  // 本文(記事 body)が読み取り領域に入っている間だけボタンを表示する。
  // 本文に入る前(ヘッダー付近)と、本文を読み終えた後(共有/関連記事/フッター)は非表示。
  useEffect(() => {
    const target = document.getElementById("post-article-body");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldShow = entry.isIntersecting;
        setIsVisible(shouldShow);
        if (!shouldShow) {
          setIsOpen(false);
        }
      },
      // 本文のごく端(最初の1行/最後の1行が画面端をかすめる瞬間)では出さず、
      // しっかり読書領域に入ってから出す/抜けたら消すfor自然な出入り。
      { rootMargin: "-72px 0px -72px 0px", threshold: 0 },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
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
          <m.button
            type="button"
            aria-label="目次を開く"
            aria-expanded={isOpen}
            aria-controls="floating-table-of-content"
            className="fixed right-4 bottom-6 z-[70] inline-flex h-14 items-center gap-2 rounded-full border border-amber-200 bg-stone-950 px-5 text-sm font-bold text-amber-50 shadow-2xl ring-1 shadow-stone-950/20 ring-white/20 transition-colors hover:bg-stone-900 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none sm:right-6 dark:border-amber-500/30 dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400"
            initial={{ opacity: 0, y: 24, scale: 0.82 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.82 }}
            transition={{ type: "spring", stiffness: 380, damping: 24, mass: 0.7 }}
            onClick={() => setIsOpen(true)}
          >
            <List className="h-5 w-5" strokeWidth={2.5} />
            <span>目次</span>
          </m.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          // 親では opacity をアニメしない。opacity アニメで子の backdrop-filter を
          // 巻き込むとブラーが最後に一気にかかるため。退場アニメは子要素側で行う。
          <m.div className="fixed inset-0 z-[80] flex items-end justify-center px-3 pb-3 sm:px-6 sm:pb-6">
            {/* 背景: パネルの開きに同期して、ブラーと暗転をじわっと効かせる */}
            <m.button
              type="button"
              aria-label="目次を閉じる"
              className="absolute inset-0"
              style={{ WebkitBackdropFilter: "blur(0px)" }}
              initial={{ backgroundColor: "rgba(12,10,9,0)", backdropFilter: "blur(0px)" }}
              animate={{ backgroundColor: "rgba(12,10,9,0.5)", backdropFilter: "blur(8px)" }}
              exit={{ backgroundColor: "rgba(12,10,9,0)", backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={() => setIsOpen(false)}
            />
            <m.div
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
              <div className="flex items-start justify-between gap-4 border-b border-stone-100 px-5 py-4 sm:px-6 dark:border-stone-800">
                <div>
                  <p className="text-xs font-bold tracking-[0.22em] text-amber-600 uppercase dark:text-amber-400">
                    Table of Contents
                  </p>
                  <h2
                    id="floating-table-of-content-title"
                    className="font-heading mt-1 text-xl font-bold text-stone-900 dark:text-stone-50"
                  >
                    目次から移動
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="目次を閉じる"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
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
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingTableOfContent;
