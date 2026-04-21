"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react"; // ▼ アイコンを変更
import { cn } from "@/lib/utils";
import Link from "next/link";

type TableOfContentProps = {
  isScrollSyncEnabled?: boolean;
};

const TableOfContent = ({
  isScrollSyncEnabled = false,
}: TableOfContentProps) => {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const articleElement = document.querySelector("article");
    if (!articleElement) return;

    const headingElements = Array.from(
      articleElement.querySelectorAll("h2, h3")
    );
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

      if (!isScrollSyncEnabled) {
        setActiveId("");
      }
    });

    if (!isScrollSyncEnabled) {
      return () => {
        window.cancelAnimationFrame(frameId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            const activeLink = navRef.current?.querySelector(
              `a[href="#${entry.target.id}"]`
            );
            if (activeLink) {
              activeLink.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest",
              });
            }
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
      }
    );

    headingElements.forEach((heading) => observer.observe(heading));

    return () => {
      window.cancelAnimationFrame(frameId);
      headingElements.forEach((heading) => observer.unobserve(heading));
    };
  }, [isScrollSyncEnabled]);

  const handleClick = (id: string) => {
    const escapedId = CSS.escape(id);
    document.querySelector(`#${escapedId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <details
      open
      className="group my-8 overflow-hidden rounded-3xl border border-stone-200/60 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-stone-800/60 dark:bg-stone-950/20"
    >
      <summary className="flex list-none cursor-pointer items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-stone-50/50 dark:hover:bg-stone-900/20">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-inner dark:bg-amber-950/20 dark:text-amber-500">
            <MapPin className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </summary>

      <nav
        ref={navRef}
        className="border-t border-stone-100/80 bg-stone-50/30 px-4 py-6 dark:border-stone-800/50 dark:bg-transparent"
      >
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:gap-3">
          {headings.map((heading) => (
            <li key={heading.id} className="list-none">
              <Link
                href={`#${heading.id}`}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200",
                  activeId === heading.id
                    ? "bg-white text-amber-600 shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-900 dark:text-amber-500 dark:ring-stone-700/50"
                    : "text-stone-600 hover:bg-white/80 hover:text-foreground hover:shadow-sm dark:text-stone-400 dark:hover:bg-stone-900/50"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(heading.id);
                }}
              >
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-full transition-all duration-300",
                    heading.level === 2
                      ? "h-2 w-2 ring-4 ring-stone-100 dark:ring-stone-800"
                      : "ml-2 h-1.5 w-1.5 ring-2 ring-stone-100 dark:ring-stone-800",
                    activeId === heading.id
                      ? "bg-amber-500 ring-amber-100 dark:ring-amber-900/30"
                      : "bg-stone-300 dark:bg-stone-600 group-hover:bg-stone-400"
                  )}
                />
                <span
                  className={cn(
                    "line-clamp-1 flex-1 leading-snug",
                    heading.level === 2 ? "font-bold" : "font-medium",
                    activeId === heading.id ? "text-amber-900 dark:text-amber-100" : ""
                  )}
                >
                  {heading.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
};

export default TableOfContent;
