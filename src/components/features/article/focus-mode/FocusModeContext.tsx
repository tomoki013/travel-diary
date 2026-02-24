"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

export type FocusMode = "off" | "minimal" | "standard" | "maximum";

type FocusModeContextValue = {
  focusMode: FocusMode;
  setFocusMode: (mode: FocusMode) => void;
  isFocusActive: boolean;
  isPostDetailPage: boolean;
};

const FocusModeContext = createContext<FocusModeContextValue | null>(null);

const isPostDetailPath = (pathname: string | null): boolean => {
  if (!pathname) return false;
  const segments = pathname.split("/").filter(Boolean);
  return segments.length === 2 && segments[0] === "posts";
};

export const FocusModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [focusMode, setFocusModeState] = useState<FocusMode>("off");
  const isPostDetailPage = isPostDetailPath(pathname);

  const setFocusMode = useCallback((mode: FocusMode) => {
    setFocusModeState(mode);
  }, []);

  const value = useMemo<FocusModeContextValue>(
    () => ({
      focusMode: isPostDetailPage ? focusMode : "off",
      setFocusMode,
      isFocusActive: isPostDetailPage && focusMode !== "off",
      isPostDetailPage,
    }),
    [focusMode, isPostDetailPage, setFocusMode]
  );

  return (
    <FocusModeContext.Provider value={value}>
      {children}
    </FocusModeContext.Provider>
  );
};

export const useFocusMode = (): FocusModeContextValue => {
  const context = useContext(FocusModeContext);
  if (!context) {
    throw new Error("useFocusMode must be used within FocusModeProvider");
  }
  return context;
};
