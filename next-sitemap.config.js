const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tomokichidiary.com"
).replace(/\/+$/, "");

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  changefreq: "weekly",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: "./public",
  exclude: ["/dashboard", "/loading-animation", "/offline"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};

module.exports = config;
