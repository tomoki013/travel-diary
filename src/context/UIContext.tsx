"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

interface UIContextValue {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
    // If opening menu, close search
    if (!isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
    // If opening search, close menu
    setIsMobileMenuOpen(false);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isSearchOpen]);

  const value = useMemo(
    () => ({
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      isSearchOpen,
      openSearch,
      closeSearch,
      toggleSearch,
    }),
    [
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      isSearchOpen,
      openSearch,
      closeSearch,
      toggleSearch,
    ]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
