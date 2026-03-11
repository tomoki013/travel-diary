import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const revision =
  process.env.COMMIT_REF?.slice(0, 7) ||
  process.env.GITHUB_SHA?.slice(0, 7) ||
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
  process.env.npm_package_version ||
  "local";

const withSerwist = withSerwistInit({
  cacheOnNavigation: false,
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

const AI_PLANNER_EXTERNAL_URL = "https://tabide.ai/";

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
        destination: AI_PLANNER_EXTERNAL_URL,
        permanent: true,
      },
      {
        source: "/ai-travel-planner",
        destination: AI_PLANNER_EXTERNAL_URL,
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
    ];
  },
  reactStrictMode: true,
};

export default withSerwist(nextConfig);
