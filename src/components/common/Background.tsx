"use client";
import { useTheme } from "next-themes";
import React, { useMemo } from "react";
import { useHydrated } from "@/hooks/useHydrated";

const Background = () => {
  const hydrated = useHydrated();
  const { theme } = useTheme();

  const particleColor = useMemo(() => {
    if (!hydrated) {
      return "rgba(245, 158, 11, 0.1)"; // Default amber
    }
    return theme === "dark" ? "rgba(251, 191, 36, 0.2)" : "rgba(245, 158, 11, 0.15)";
  }, [hydrated, theme]);

  const particles = useMemo(() => {
    if (!hydrated) return [];

    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isSmallScreen =
      typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

    if (isReducedMotion) return [];

    // Keep particle count low for performance
    const count = isSmallScreen ? 12 : 24;

    return Array.from({ length: count }).map((_, i) => {
      const seed = i + 1;
      const size = 1 + (seed % 3);
      const x = (seed * 17) % 100;
      const y = (seed * 29) % 100;
      const duration = 20 + (seed % 20);
      const delay = -((seed * 7) % 20);
      const xEnd = (seed * 37) % 100;
      const yEnd = (seed * 53) % 100;
      return {
        id: i,
        size,
        x,
        y,
        duration,
        delay,
        xEnd,
        yEnd,
      };
    });
  }, [hydrated]);

  if (!hydrated) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-50 h-full w-full overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full opacity-60"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Removed feGaussianBlur filter as it's very heavy on scroll */}
        {particles.map((p) => (
          <circle key={p.id} r={p.size} fill={particleColor}>
            <animate
              attributeName="cx"
              from={`${p.x}%`}
              to={`${p.xEnd}%`}
              dur={`${p.duration}s`}
              begin={`${p.delay}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
            />
            <animate
              attributeName="cy"
              from={`${p.y}%`}
              to={`${p.yEnd}%`}
              dur={`${p.duration * 1.2}s`}
              begin={`${p.delay}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur={`${p.duration}s`}
              begin={`${p.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
      <div className="from-background via-background/80 absolute inset-0 bg-gradient-to-t to-transparent"></div>
    </div>
  );
};

export default Background;
