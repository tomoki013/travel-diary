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
        destination: "https://travel-map-for-tomokichidiary.netlify.app/",
      },
      {
        source: "/map/:path*",
        destination:
          "https://travel-map-for-tomokichidiary.netlify.app/map/:path*",
      },

      // // 2. AI Travel Planner (例)
      // {
      //   source: "/ai-planner",
      //   destination: "https://【AIアプリのデプロイ先URL】/ai-planner",
      // },
      // {
      //   source: "/ai-planner/:path*",
      //   destination: "https://【AIアプリのデプロイ先URL】/ai-planner/:path*",
      // },
    ];
  },
};

export default withSerwist({
  // Serwist の設定
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
