import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import { execSync } from "child_process";

// git commit hashをキャッシュバージョン番号として使用
const revision = execSync("git rev-parse HEAD", { encoding: "utf8" })
  .trim()
  .slice(0, 7);

const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  reloadOnOnline: false,
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: [
    { url: "/", revision },
    // オプション
    { url: "/offline", revision },
  ],
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    loader: "custom",
    loaderFile: "./netlify-loader.ts",
  },

  async redirects() {
    return [
      {
        source: "/ai-planner",
        destination: "/ai-travel-planner",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      // 1. Tomokichi Globe (マップ)
      {
        source: "/map",
        // destinationの末尾に / をつけておくと安全です
        destination: "https://travel-map-for-tomokichidiary.netlify.app/map/",
      },
      {
        source: "/map/", // スラッシュありのパターンも念の為
        destination: "https://travel-map-for-tomokichidiary.netlify.app/map/",
      },
      {
        source: "/map/:path*",
        destination:
          "https://travel-map-for-tomokichidiary.netlify.app/map/:path*",
      },

      // 2. AI Travel Planner（AI旅行プランナー）
      {
        source: "/ai-travel-planner",
        // destinationの末尾に / をつけておくと安全です
        destination:
          "https://ai-travel-planner-tomokichi.netlify.app/ai-travel-planner/",
      },
      {
        source: "/ai-travel-planner/", // スラッシュありのパターンも念の為
        destination: "https://ai-travel-planner-tomokichi.netlify.app/ai-travel-planner/",
      },
      {
        source: "/ai-travel-planner/:path*",
        destination:
          "https://ai-travel-planner-tomokichi.netlify.app/ai-travel-planner/:path*",
      },
    ];
  },
  reactStrictMode: true,
};

export default withSerwist(nextConfig);
