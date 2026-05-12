"use client";

import { MenuIcon, XIcon } from "@/components/common/Icons";
import { NAV_LINKS } from "@/constants/navigation";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useUI } from "@/context/UIContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  SearchIcon,
  Sparkles,
  Home,
  Map,
  BookOpen,
  Image as ImageIcon,
  Mail,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ModeToggle from "../common/mode-toggle";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const SearchOverlay = dynamic(() => import("../features/search/SearchOverlay"), {
  ssr: false,
  loading: () => null,
});

const Header = () => {
  const { isMenuOpen, toggleMenu, closeMenu } = useMobileMenu();
  const { isSearchOpen, openSearch, closeSearch } = useUI();
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(() => !isHomePage);

  useBodyScrollLock(isSearchOpen || isMenuOpen);

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    let ticking = false;

    const updateScrolledState = () => {
      ticking = false;
      const nextIsScrolled = window.scrollY > 24;
      setIsScrolled((current) => (current === nextIsScrolled ? current : nextIsScrolled));
    };

    const handleScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateScrolledState);
    };

    updateScrolledState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  const isTransparent = isHomePage && !isScrolled && !isMenuOpen && !isSearchOpen;

  // Icon mapping for mobile menu
  const NAV_ICONS: Record<string, React.ElementType> = {
    Home: Home,
    Destination: Map,
    Blog: BookOpen,
    Gallery: ImageIcon,
    Contact: Mail,
    About: Info,
  };

  return (
    <>
      <header
        className={cn(
          "top-0 z-[100] w-full border-b transition-[background-color,border-color,box-shadow,padding,backdrop-filter] duration-300 ease-out",
          isHomePage ? "fixed" : "sticky",
          isTransparent
            ? "border-transparent bg-transparent py-6"
            : "border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/80 py-2 shadow-sm backdrop-blur-md",
        )}
      >
        <div className="container mx-auto flex h-12 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Area */}
          <Link
            href="/"
            className="group relative z-50 flex items-center gap-3"
            onClick={closeMenu}
          >
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-heading text-xl leading-none font-bold transition-colors duration-300",
                  isTransparent && !isMenuOpen
                    ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" // Heroの文字と同様のシャドウ感
                    : "text-foreground",
                )}
              >
                ともきちの旅行日記
              </span>
              <span
                className={cn(
                  "font-code mt-0.5 text-[10px] tracking-[0.2em] uppercase transition-colors duration-300",
                  isTransparent && !isMenuOpen
                    ? "text-white/80 drop-shadow-md"
                    : "text-muted-foreground group-hover:text-primary",
                )}
              >
                Travel Diary
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "group font-heading relative py-2 text-sm font-bold tracking-wide transition-all duration-300",
                  isTransparent
                    ? "text-white/90 drop-shadow-md hover:text-white"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {/* Underline Animation */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-300 ease-out group-hover:w-full",
                    isTransparent
                      ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      : "bg-primary",
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop Icons & Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Utility Icons */}
            <div className="ml-2 flex items-center gap-3">
              <button
                onClick={openSearch}
                className={cn(
                  "flex items-center gap-2 rounded-full border-2 px-4 py-1.5 shadow-sm transition-all duration-300",
                  isTransparent
                    ? "border-white/30 bg-black/20 text-white backdrop-blur-md hover:border-white/50 hover:bg-white/20"
                    : "bg-background/80 border-border/80 text-foreground hover:border-primary/50 hover:bg-background",
                )}
                aria-label="Search"
              >
                <SearchIcon className="h-4 w-4" />
                <span className="hidden text-xs font-bold tracking-wider uppercase lg:inline-block">
                  Search
                </span>
              </button>
              <div className={cn("transition-opacity", isTransparent && "opacity-90")}>
                <ModeToggle />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={openSearch}
              className={cn(
                "flex items-center justify-center rounded-full border-2 p-2 shadow-sm transition-all",
                isTransparent && !isMenuOpen
                  ? "border-white/30 bg-black/20 text-white backdrop-blur-md hover:bg-white/20"
                  : "bg-background/80 border-border/80 text-foreground hover:border-primary/50",
              )}
              aria-label="Search"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
            <div
              className={cn(
                "scale-90 transition-opacity",
                isTransparent && !isMenuOpen && "opacity-90",
              )}
            >
              <ModeToggle />
            </div>
            <button
              onClick={toggleMenu}
              className={cn(
                "relative z-50 rounded-full p-2 transition-colors",
                isMenuOpen
                  ? "text-foreground bg-accent"
                  : isTransparent
                    ? "text-white hover:bg-white/10"
                    : "text-foreground hover:bg-accent",
              )}
              aria-label="Menu"
            >
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            key="mobile-menu"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="bg-background/95 fixed inset-0 z-[90] flex touch-none flex-col md:hidden"
          >
            <div className="from-background/50 to-background pointer-events-none absolute inset-0 bg-gradient-to-b" />

            <div className="relative container mx-auto flex h-full flex-col justify-between gap-4 overflow-hidden px-6 pt-20 pb-8">
              <nav className="mx-auto flex w-full max-w-sm flex-col gap-2">
                {NAV_LINKS.map((link, index) => {
                  const Icon = NAV_ICONS[link.label] || Sparkles;
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05, type: "spring" }}
                    >
                      <Link
                        href={link.href}
                        className="group text-foreground/80 hover:bg-accent hover:text-foreground flex items-center gap-4 rounded-xl p-3 transition-all"
                        onClick={closeMenu}
                      >
                        <div className="bg-secondary/50 text-foreground group-hover:bg-primary group-hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-heading text-xl font-bold tracking-wide">
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mx-auto flex w-full max-w-sm flex-col items-center gap-y-4"
              >
                <div className="bg-border/50 h-px w-full" />
                <div className="flex w-full items-center justify-between px-4">
                  <span className="text-muted-foreground text-sm font-bold">Theme</span>
                  <ModeToggle />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
};

export default Header;
