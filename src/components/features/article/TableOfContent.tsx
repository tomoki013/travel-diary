"use client";

import { useState, useEffect, useRef, type RefObject } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type ArticleHeading = { id: string; text: string; level: number };

interface TableOfContentProps {
  isScrollSyncEnabled?: boolean;
  headings?: ArticleHeading[];
  activeId?: string;
}

type TableOfContentNavProps = {
  headings: ArticleHeading[];
  activeId: string;
  navRef: RefObject<HTMLDivElement | null>;
  onHeadingClick?: () => void;
  className?: string;
  listClassName?: string;
};

export const scrollToArticleHeading = (id: string) => {
  const escapedId = CSS.escape(id);
  document.querySelector(`#${escapedId}`)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
};

export const useHeadings = (enabled: boolean = true) => {
  const [headings, setHeadings] = useState<ArticleHeading[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const articleElement = document.querySelector("article");
    if (!articleElement) return;

    const headingElements = Array.from(articleElement.querySelectorAll("h2, h3"));
    const extractedHeadings = headingElements.map((heading, index) => {
      const text = heading.textContent || "";
      const escapedText = text.trim().replace(/\s+/g, "-");
      const id = heading.id || `heading-${escapedText}-${index}`;
      if (!heading.id) {
        heading.id = id;
      }
      return {
        id,
        text,
        level: heading.tagName === "H2" ? 2 : 3,
      };
    });

    const frameId = window.requestAnimationFrame(() => {
      setHeadings(extractedHeadings);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [enabled]);

  return headings;
};

export const useScrollSync = (
  headings: ArticleHeading[],
  isEnabled: boolean = false,
  navRef?: RefObject<HTMLDivElement | null>,
  shouldScrollIntoView: boolean = false,
) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!isEnabled || headings.length === 0) {
      if (!isEnabled) setActiveId("");
      return;
    }

    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            if (shouldScrollIntoView) {
              const activeLink = navRef?.current?.querySelector(`a[href="#${entry.target.id}"]`);
              if (activeLink) {
                activeLink.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "nearest",
                });
              }
            }
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
      },
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
    };
  }, [isEnabled, headings, navRef, shouldScrollIntoView]);

  return activeId;
};

// Backwards compatibility or legacy use if needed, but we'll prefer shared state
export const useArticleHeadings = (
  isScrollSyncEnabled: boolean = false,
  navRef?: RefObject<HTMLDivElement | null>,
) => {
  const headings = useHeadings();
  const activeId = useScrollSync(headings, isScrollSyncEnabled, navRef);

  return { headings, activeId };
};

export const TableOfContentNav = ({
  headings,
  activeId,
  navRef,
  onHeadingClick,
  className,
  listClassName,
}: TableOfContentNavProps) => (
  <nav
    ref={navRef}
    className={cn(
      "border-t border-stone-100/80 bg-stone-50/20 px-5 py-5 dark:border-stone-800/50 dark:bg-transparent",
      className,
    )}
  >
    <ul className={cn("grid grid-cols-1 gap-x-8 sm:grid-cols-2", listClassName)}>
      {headings.map((heading, index) => (
        <li
          key={heading.id}
          className="list-none border-b border-stone-200/70 last:border-b-0 sm:last:border-b dark:border-stone-800/70 sm:[&:nth-last-child(-n+2)]:border-b-0"
        >
          <Link
            href={`#${heading.id}`}
            aria-current={activeId === heading.id ? "true" : undefined}
            className={cn(
              "group/toc-link relative flex items-start gap-3 py-3.5 text-sm transition-colors duration-200",
              heading.level === 3 ? "pl-5" : "",
              activeId === heading.id
                ? "text-amber-700 dark:text-amber-300"
                : "text-stone-700 hover:text-amber-700 dark:text-stone-300 dark:hover:text-amber-300",
            )}
            onClick={(e) => {
              e.preventDefault();
              scrollToArticleHeading(heading.id);
              onHeadingClick?.();
            }}
          >
            <span
              className={cn(
                "absolute top-3.5 left-0 h-[calc(100%-1.75rem)] w-px bg-stone-200 transition-colors duration-200 dark:bg-stone-800",
                activeId === heading.id
                  ? "bg-amber-500 dark:bg-amber-400"
                  : "group-hover/toc-link:bg-amber-400",
              )}
            />
            <div
              className={cn(
                "mt-0.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold tabular-nums transition-colors duration-200",
                heading.level === 3 ? "h-4 min-w-4 text-[9px]" : "",
                activeId === heading.id
                  ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-950/30 dark:text-amber-200"
                  : "border-stone-300 bg-white text-stone-500 group-hover/toc-link:border-amber-400 group-hover/toc-link:text-amber-700 dark:border-stone-700 dark:bg-stone-950/60 dark:text-stone-400 dark:group-hover/toc-link:border-amber-500 dark:group-hover/toc-link:text-amber-300",
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "line-clamp-2 flex-1 leading-snug underline-offset-4 transition-[text-decoration-color] duration-200 group-hover/toc-link:underline",
                heading.level === 2 ? "font-bold" : "font-medium",
                activeId === heading.id
                  ? "text-amber-900 underline decoration-amber-300 dark:text-amber-100 dark:decoration-amber-500/70"
                  : "decoration-amber-300/80 dark:decoration-amber-500/70",
              )}
            >
              {heading.text}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

const TableOfContent = ({
  isScrollSyncEnabled = false,
  headings: propHeadings,
  activeId: propActiveId,
}: TableOfContentProps) => {
  const navRef = useRef<HTMLDivElement>(null);

  // Fallback to internal state if props are not provided
  const internalHeadings = useHeadings(!propHeadings);
  const internalActiveId = useScrollSync(
    internalHeadings,
    isScrollSyncEnabled && !propActiveId,
    navRef,
  );

  const headings = propHeadings ?? internalHeadings;
  const activeId = propActiveId ?? internalActiveId;

  if (headings.length === 0) {
    return null;
  }

  return (
    <details
      open
      className="group my-8 overflow-hidden rounded-3xl border border-stone-200/60 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-stone-800/60 dark:bg-stone-950/20"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-stone-50/50 dark:hover:bg-stone-900/20">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-inner dark:bg-amber-950/20 dark:text-amber-500">
            <MapPin className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">
              今回の旅程 (目次)
            </h3>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
              タップして各セクションへ移動
            </p>
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-50 text-stone-400 transition-all duration-500 group-open:rotate-180 group-open:bg-amber-50 group-open:text-amber-600 dark:bg-stone-900 dark:text-stone-500 dark:group-open:bg-amber-900/20 dark:group-open:text-amber-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </summary>

      <TableOfContentNav headings={headings} activeId={activeId} navRef={navRef} />
    </details>
  );
};

export default TableOfContent;
