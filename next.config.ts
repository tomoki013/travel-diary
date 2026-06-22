import type { NextConfig } from "next";
import { createRequire } from "module";

const AI_PLANNER_EXTERNAL_URL = "https://tabide.ai/";

// package.json を唯一のバージョン source of truth とし、UI へはここから注入する。
// （UpdateList などにバージョン番号を手書きで重複させない＝編集箇所を減らす）
const { version: APP_VERSION } = createRequire(import.meta.url)("./package.json") as {
  version: string;
};

const nextConfig: NextConfig = {
  /* config options here */
  // ビルド時にバージョンをバンドルへインライン展開（サーバー/クライアント共通）。
  env: {
    NEXT_PUBLIC_APP_VERSION: APP_VERSION,
  },
  // Pin the file-tracing root to this project so Next does not infer a parent
  // workspace root when multiple lockfiles are present (e.g. git worktrees).
  outputFileTracingRoot: process.cwd(),
  // ローカル検証用にビルド出力先を切り替え可能にする(Windows で .next が
  // 他プロセスにロックされて削除できない場合の回避策)。未指定時は従来どおり。
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // X-Powered-By ヘッダーを無効化(使用フレームワークの広告は不要)
  poweredByHeader: false,
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
