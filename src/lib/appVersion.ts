/**
 * アプリのバージョン（package.json の version）。
 * next.config.ts でビルド時に `NEXT_PUBLIC_APP_VERSION` として注入している。
 * 表示用の単一の参照ポイント。バージョンの真実は package.json のみ。
 */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "";
