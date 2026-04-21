"use client";
import { useTheme } from "next-themes";
import React, { useMemo } from "react";
import { useHydrated } from "@/hooks/useHydrated";

const Background = () => {
  const hydrated = useHydrated();
  const { theme } = useTheme();

  const particleColor = useMemo(() => {
    if (!hydrated) {
      return "#ffffff"; // SSR/initial fallback
    }
    return theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  }, [hydrated, theme]);

  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const seed = i + 1;
      const size = 1 + (seed % 3);
      const x = (seed * 17) % 100;
      const y = (seed * 29) % 100;
      const duration = 10 + (seed % 11);
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
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full -z-50 overflow-hidden bg-background"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter id="blur-filter">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
        {particles.map((p) => (
          <circle
            key={p.id}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r={p.size}
            fill={particleColor}
            className="animate-particle"
            style={
              {
                "--duration": `${p.duration}s`,
                "--delay": `${p.delay}s`,
                "--x-start": `${p.x}%`,
                "--y-start": `${p.y}%`,
                "--x-end": `${p.xEnd}%`,
                "--y-end": `${p.yEnd}%`,
              } as React.CSSProperties
            }
            filter="url(#blur-filter)"
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
    </div>
  );
};

export default Background;
