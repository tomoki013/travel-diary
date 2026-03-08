"use client";

import { MenuIcon, XIcon } from "@/components/common/Icons";
import { NAV_LINKS } from "@/constants/navigation";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { useUI } from "@/context/UIContext";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  SearchIcon,
  Sparkles,
  Home,
  Map,
  BookOpen,
  Image as ImageIcon,
  Mail,
  Info,
  Globe,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ModeToggle from "../common/mode-toggle";
import SearchOverlay from "../features/search/SearchOverlay";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { AI_PLANNER_PATH, MAP_PATH } from "@/constants/site";
import { useFocusMode } from "../features/article/focus-mode/FocusModeContext";

const Header = () => {
  const { isMenuOpen, toggleMenu, closeMenu } = useMobileMenu();
  const { isSearchOpen, openSearch, closeSearch } = useUI();
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { isFocusActive } = useFocusMode();

  // スムーズなスクロールベースのアニメーション用
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 200], [isHomePage ? 0 : 1, 1]);
  const blurAmount = useTransform(scrollY, [0, 200], [isHomePage ? 0 : 16, 16]);

  // 背景色のアニメーション（ライト/ダークモード対応）
  const headerBg = useTransform(bgOpacity, (opacity) => {
    if (opacity === 0) {
      return "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), transparent)";
    }
    // ダークモードとライトモードで背景色を切り替え
    return `rgba(var(--background), ${opacity * 0.8})`;
  });

  const backdropBlur = useTransform(blurAmount, (blur) => `blur(${blur}px)`);

  useEffect(() => {
    const handleScroll = () => {
      // スクロール検知の閾値を少し深めに設定し、Hero画像内での体験を安定させる
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ... (スクロールロックやクリック外判定のuseEffectは変更なし) ...
  useEffect(() => {
    if (isSearchOpen || isMenuOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isSearchOpen, isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  // 透過状態かどうか
  const isTransparent = isHomePage && !isScrolled;

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
      <motion.header
        className={cn(
          "top-0 z-[100] w-full max-h-40 overflow-hidden transition-[max-height,opacity,transform,padding,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isTransparent
            ? "fixed py-6 border-transparent"
            : "sticky py-2 border-b border-border/40 shadow-sm bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80",
          isFocusActive &&
            "max-h-0 py-0 opacity-0 -translate-y-6 pointer-events-none border-transparent shadow-none"
        )}
        style={{
          background: isHomePage ? headerBg : undefined,
          backdropFilter: isHomePage ? backdropBlur : undefined,
          WebkitBackdropFilter: isHomePage ? backdropBlur : undefined,
        }}
      >
        <div className="container mx-auto flex h-12 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Area */}
          <Link
            href="/"
            className="relative z-50 flex items-center gap-3 group"
            onClick={closeMenu}
          >
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-heading font-bold text-xl leading-none transition-colors duration-300",
                  isTransparent && !isMenuOpen
                    ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" // Heroの文字と同様のシャドウ感
                    : "text-foreground",
                )}
              >
                ともきちの旅行日記
              </span>
              <span
                className={cn(
                  "text-[10px] font-code tracking-[0.2em] uppercase transition-colors duration-300 mt-0.5",
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
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative text-sm font-bold tracking-wide transition-all duration-300 group py-2 font-heading",
                  isTransparent
                    ? "text-white/90 hover:text-white drop-shadow-md"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {/* Underline Animation */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 ease-out group-hover:w-full rounded-full",
                    isTransparent
                      ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      : "bg-primary",
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop Icons & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* AI Planner Button */}
            <Link
              href={AI_PLANNER_PATH}
              className={cn(
                "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95",
                isTransparent
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
              )}
            >
              <Sparkles className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-12" />
              <span>AI PLANNER</span>
              <ExternalLink className="h-3 w-3 opacity-70 ml-0.5" />
            </Link>

            {/* Tomokichi Globe Button */}
            <Link
              href={MAP_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95",
                isTransparent
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
              )}
            >
              <Globe className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-12" />
              <span>GLOBE</span>
              <ExternalLink className="h-3 w-3 opacity-70 ml-0.5" />
            </Link>

            {/* Utility Icons */}
            <div
              className={cn(
                "flex items-center gap-1 rounded-full p-1 transition-colors duration-300 ml-2",
                isTransparent
                  ? "bg-black/20 backdrop-blur-md border border-white/10"
                  : "bg-secondary/50 border border-border/50",
              )}
            >
              <button
                onClick={openSearch}
                className={cn(
                  "p-2 rounded-full transition-all hover:scale-110",
                  isTransparent
                    ? "text-white hover:bg-white/20"
                    : "text-foreground hover:bg-background shadow-sm",
                )}
                aria-label="Search"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
              <div className={cn(isTransparent && "text-white")}>
                <ModeToggle />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={openSearch}
              className={cn(
                "p-2 rounded-full transition-all",
                isTransparent && !isMenuOpen
                  ? "text-white hover:bg-white/20"
                  : "text-foreground hover:bg-background shadow-sm",
              )}
            >
              <SearchIcon className="h-5 w-5" />
            </button>
            <button
              onClick={toggleMenu}
              className={cn(
                "relative z-50 p-2 rounded-full transition-colors",
                isMenuOpen
                  ? "text-foreground"
                  : isTransparent
                    ? "text-white hover:bg-white/10"
                    : "text-foreground hover:bg-accent",
              )}
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

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
            className="fixed inset-0 z-[90] bg-background/95 md:hidden flex flex-col touch-none"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background pointer-events-none" />

            <div className="container relative mx-auto flex h-full flex-col gap-4 px-6 pt-20 pb-8 justify-between overflow-hidden">
              <nav className="flex flex-col gap-2 w-full max-w-sm mx-auto">
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
                        className="group flex items-center gap-4 rounded-xl p-3 text-foreground/80 transition-all hover:bg-accent hover:text-foreground"
                        onClick={closeMenu}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold font-heading tracking-wide">
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
                className="flex flex-col items-center gap-y-4 w-full max-w-sm mx-auto"
              >
                <div className="w-full h-px bg-border/50" />
                <div className="flex w-full items-center justify-between px-4">
                  <span className="text-sm font-bold text-muted-foreground">
                    Theme
                  </span>
                  <ModeToggle />
                </div>
                <Link
                  href={AI_PLANNER_PATH}
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90"
                >
                  <Sparkles className="h-5 w-5" />
                  AIプランナーを使う
                </Link>
                <Link
                  href={MAP_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90"
                >
                  <Globe className="h-5 w-5" />
                  Tomokichi Globe
                  <ExternalLink className="h-4 w-4 opacity-70 ml-1" />
                </Link>
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
