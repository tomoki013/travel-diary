const normalizedSiteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tomokichidiary.com"
).replace(/\/+$/, "");

export const PRIMARY_SITE_URL = normalizedSiteUrl;
export const MAP_PATH = "https://globe.tabide.ai/p/d5922ec482";
export const MAP_URL = MAP_PATH;
export const AI_PLANNER_PATH = "/ai-planner";
export const AI_PLANNER_EXTERNAL_URL = "https://tabide.ai/";
export const SITE_STATUS_PATH = "/roadmap#site-status";
export const ENABLE_AFFILIATES = false; // AdSense審査中はfalseにして非表示にする
