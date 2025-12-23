import type { NextConfig } from "next";
import withSerwist from "@serwist/next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    loader: "custom",
    loaderFile: "./netlify-loader.ts",
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
        destination: "https://ai-travel-planner-tomokichi.netlify.app/ai-travel-planner/",
      },
      {
        source: "/map/", // スラッシュありのパターンも念の為
        destination: "https://ai-travel-planner-tomokich.netlify.app/ai-travel-planner/",
      },
      {
        source: "/map/:path*",
        destination:
          "https://ai-travel-planner-tomokich.netlify.app/ai-travel-planner/:path*",
      },
    ];
  },
};

export default withSerwist({
  // Serwist の設定
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
