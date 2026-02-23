const normalizedSiteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tomokichidiary.com"
).replace(/\/+$/, "");

export const PRIMARY_SITE_URL = normalizedSiteUrl;
export const MAP_PATH = "/map";
export const MAP_URL = `${PRIMARY_SITE_URL}${MAP_PATH}`;
export const AI_PLANNER_PATH = "/ai-planner";
export const AI_PLANNER_EXTERNAL_URL = "https://tabide.ai/";
export const SITE_STATUS_PATH = "/roadmap#site-status";
