import type { Metadata, Viewport } from "next";
import {
  Caveat,
  Montserrat,
  Playfair_Display,
  Noto_Sans_JP,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/common/theme-provider";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import CookieBanner from "@/components/common/CookieBanner";
import Background from "@/components/common/Background";
import { PRIMARY_SITE_URL } from "@/constants/site";

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
});

export const metadata: Metadata = {
  title: {
    default: "ともきちの旅行日記 | Travel Diary",
    template: "%s | ともきちの旅行日記",
  },
  description:
    "ともきちの旅行日記は、日本国内外の旅先体験を写真とコラムで詳細に紹介するブログです。観光スポットやグルメ、穴場レポートを網羅し、文化体験記事や現地グルメコラム、旅費計算・世界時計・旅行先ルーレット・税金計算・予算管理機能など多彩なツールで旅行準備から思い出の記録までサポートし、旅のプラン立案を支援。",
  authors: [{ name: "ともきち" }],
  openGraph: {
    title: "ともきちの旅行日記 | Travel Diary",
    description:
      "日本と世界の美しい風景、文化、食べ物を通じて、新しい旅の発見をお届けする旅行ブログ。",
    url: PRIMARY_SITE_URL,
    siteName: "ともきちの旅行日記",
    type: "website",
    images: [
      {
        url: "favicon.ico",
        width: 1200,
        height: 630,
        alt: "ともきちの旅行日記",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ともきちの旅行日記 | Travel Diary",
    description:
      "日本と世界の美しい風景、文化、食べ物を通じて、新しい旅の発見をお届けする旅行ブログ。",
    images: ["favicon.ico"],
  },
  metadataBase: new URL(PRIMARY_SITE_URL),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ともきちの旅行日記",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fdfaf6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* impact */}
        <meta
          name="impact-site-verification"
          content="6961c957-6c21-44ec-90ac-fbe728936d15"
        />

        {/* Agoda */}
        <meta name="agd-partner-manual-verification" />

        {/* GetYourGuide Analytics */}
        <Script
          async
          defer
          src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
          data-gyg-partner-id="GTNOM0E"
        ></Script>

        {/* Google Adsense */}
        <meta name="google-adsense-account" content="ca-pub-8687520805381056" />

        {/* Google Adsense 自動広告 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8687520805381056"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        ></Script>

        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-S35FPGY6NW"
        ></Script>

        {/* Google Analytics */}
        <Script id="google-analytics">
          {`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-S35FPGY6NW');
					`}
        </Script>
      </head>
      <body
        className={`${montserrat.variable} ${playfairDisplay.variable} ${caveat.variable} ${notoSansJp.variable} antialiased`}
      >
        <ThemeProvider
          attribute={`class`}
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Background />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 text-sm md:text-base">{children}</main>
            <Footer />
          </div>
          <CookieBanner />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
