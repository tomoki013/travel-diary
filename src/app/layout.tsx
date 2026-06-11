import type { Metadata, Viewport } from "next";
import {
  Caveat,
  Montserrat,
  Playfair_Display,
  Noto_Sans_JP,
  Shippori_Mincho,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/common/theme-provider";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import CookieBanner from "@/components/common/CookieBanner";
import Background from "@/components/common/Background";
import { DEFAULT_SOCIAL_IMAGE_URL, ENABLE_AFFILIATES, PRIMARY_SITE_URL } from "@/constants/site";
import { UIProvider } from "@/context/UIContext";
import MotionProvider from "@/components/common/MotionProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-playfair-display",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-caveat",
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  // メインの日本語フォント。約40分割スライスを critical path で
  // 一斉プリロードすると帯域を食い潰し LCP を阻害するため preload は無効化し、
  // display: "swap" でフォールバック即時描画 → 到着後に差し替える。
  preload: false,
});

// 見出し用の日本語明朝。欧文 Playfair Display と組み合わせ、日本語見出しを
// 全環境で同一の明朝体に統一する。本文同様、約40分割スライスの一斉プリロードを
// 避けるため preload は無効化し display: "swap" で描画後に差し替える。
// weight は 700 のみ。`.font-heading` の全使用箇所が font-bold / font-semibold
// であることを確認済みで、500 を読み込むと @font-face CSS と woff2 が
// 1ウェイト分(gzip 約33KB + フォント実体)丸ごと無駄になる。
const shipporiMincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-shippori-mincho",
  display: "swap",
  preload: false,
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
        url: DEFAULT_SOCIAL_IMAGE_URL,
        width: 1200,
        height: 675,
        alt: "ともきちの旅行日記",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ともきちの旅行日記 | Travel Diary",
    description:
      "日本と世界の美しい風景、文化、食べ物を通じて、新しい旅の発見をお届けする旅行ブログ。",
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
  // NOTE: ここに alternates.canonical を置いてはいけない。ルートレイアウトの
  // metadata は全ページへ継承されるため、全ページがトップページを正規URLと
  // 宣言してしまい検索エンジンから重複ページ扱いされる(AdSense審査にも影響)。
  metadataBase: new URL(PRIMARY_SITE_URL),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ともきちの旅行日記",
  },
  verification: {
    other: {
      "impact-site-verification": ["6961c957-6c21-44ec-90ac-fbe728936d15"],
      "agd-partner-manual-verification": [""],
    },
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
    // data-scroll-behavior: globals.css の scroll-behavior:smooth を
    // Next.js のルート遷移時に無効化させるための宣言(コンソール警告対応)
    <html lang="ja" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${montserrat.variable} ${playfairDisplay.variable} ${caveat.variable} ${notoSansJp.variable} ${shipporiMincho.variable} antialiased`}
      >
        {/* 第三者ドメインへのDNS事前解決（React 19 が <head> へホイストする）。
            スクリプトは lazyOnload で遅延読み込みするため preconnect は
            接続がアイドルタイムアウトして無駄になる（Lighthouse 指摘）。
            軽量な dns-prefetch のみ残す。フォントは自己ホスト＝同一オリジン。 */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* GetYourGuide Analytics（アフィリエイト有効時のみ読み込む） */}
        {ENABLE_AFFILIATES && (
          <Script
            async
            defer
            src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
            data-gyg-partner-id="GTNOM0E"
            strategy="lazyOnload"
          />
        )}

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BZJ1EDMYTZ"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BZJ1EDMYTZ');
          `}
        </Script>

        <ThemeProvider
          attribute={`class`}
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MotionProvider>
            <UIProvider>
              <Background />
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 text-sm md:text-base">{children}</main>
                <Footer />
              </div>
              <CookieBanner />
              <Toaster />
            </UIProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
