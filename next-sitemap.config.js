/* eslint-disable @typescript-eslint/no-require-imports */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tomokichidiary.com").replace(
  /\/+$/,
  "",
);

// noindex: true の記事スラグを .posts.metadata.json から読み込む
let noindexPostPaths = new Set();
try {
  const postsMetadata = require("./.posts.metadata.json");
  noindexPostPaths = new Set(
    postsMetadata.filter((p) => p.noindex === true).map((p) => `/posts/${p.slug}`),
  );
} catch {
  // prebuild前など、ファイルが存在しない場合は空セットで続行
}

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  changefreq: "weekly",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: "./public",
  exclude: [
    "/dashboard",
    "/loading-animation",
    "/offline",
    // noindex 対象ページ（AdSense再審査対応）
    "/roadmap",
    "/affiliates",
    // noindex を宣言しているページ群。sitemap に載せると Search Console で
    // 「送信された URL に noindex タグが追加されています」エラーになるため除外する。
    // 各 page.tsx の robots 設定と必ず同期させること。
    "/gallery",
    "/social",
    "/request",
    "/sitemap",
    "/series",
    "/series/*",
    // 執筆用の内部ページ（本番では404、プレビュー環境では認証必須）
    "/preview",
    "/preview/*",
    // 記事2件以下(子地域の記事も集計)の地域ページ。
    // destination/[region] の generateMetadata にある動的 noindex 判定と同期させる
    // こと。記事が増えて noindex が外れたらここからも削除する。
    // 確認方法: ビルド後に .next/server/app/destination/*.html を noindex で grep。
    "/destination/agra",
    "/destination/belgium",
    "/destination/brussels",
    "/destination/hokkaido",
    "/destination/istanbul",
    "/destination/new-delhi",
    "/destination/osaka",
    "/destination/seminyak",
    "/destination/sentosa",
    "/destination/seoul",
    "/destination/singapore-city",
    "/destination/south-korea",
    "/destination/yogyakarta",
  ],
  // noindex: true の記事をsitemapから除外する
  transform: async (config, path) => {
    if (noindexPostPaths.has(path)) return null;
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};

module.exports = config;
