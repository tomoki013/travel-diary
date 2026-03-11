export function isPreviewEnabled() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.ENABLE_PREVIEW === "true"
  );
}
