// netlify-loader.ts

import type { ImageLoaderProps } from "next/image";

const isProduction = process.env.NODE_ENV === "production";

/**
 * NetlifyのImage CDNのURLを生成するためのカスタムローダー関数です。
 * @param src - 元画像のパス (例: /images/your-image.jpeg)
 * @param width - 指定された画像の幅 (ピクセル単位)
 * @param quality - 指定された画像の品質 (Netlifyの標準CDNでは未使用)
 * @returns Netlifyで変換された画像のURL
 */
export default function netlifyLoader({ src, width, quality }: ImageLoaderProps): string {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
  });

  if (quality) {
    params.set("q", String(quality));
  }

  if (isProduction) {
    return `/.netlify/images?${params.toString()}`;
  }

  // In development, we return the original src but append params
  return `${src}?${params.toString()}`;
}
