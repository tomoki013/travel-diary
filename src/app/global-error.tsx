"use client";

import {
  Caveat,
  Montserrat,
  Playfair_Display,
  Noto_Sans_JP,
  Shippori_Mincho,
} from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import ErrorDisplay from "@/components/common/ErrorDisplay";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-playfair-display",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-caveat",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
});

const shipporiMincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-shippori-mincho",
  display: "swap",
  preload: false,
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ja">
      <body
        className={`${montserrat.variable} ${playfairDisplay.variable} ${caveat.variable} ${notoSansJp.variable} ${shipporiMincho.variable} antialiased`}
      >
        <ErrorDisplay reset={reset} />
      </body>
    </html>
  );
}
