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
    // 記事1件以下の地域ページ
    "/destination/osaka",
    "/destination/istanbul",
    "/destination/sentosa",
    "/destination/yogyakarta",
    "/destination/seoul",
    "/destination/brussels",
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
