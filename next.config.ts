import type { NextConfig } from "next";

const AI_PLANNER_EXTERNAL_URL = "https://tabide.ai/";

const nextConfig: NextConfig = {
  /* config options here */
  // Pin the file-tracing root to this project so Next does not infer a parent
  // workspace root when multiple lockfiles are present (e.g. git worktrees).
  outputFileTracingRoot: process.cwd(),
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
        destination: "https://travel-map-for-tomokichidiary.netlify.app/map/:path*",
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;
