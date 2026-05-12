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
export default function netlifyLoader({ src, width }: ImageLoaderProps): string {
  // ImageLoaderPropsからqualityも受け取れますが、
  // Netlifyの基本的な画像変換では使わないため、ここでは含めていません。

  // Next.js requires the loader to handle/mention the width parameter.
  if (isProduction) {
    return `/.netlify/images?url=${src}&w=${width}`;
  }

  // In development, we return the original src but append width as a dummy param
  // to avoid "loader does not implement width" console warnings.
  return `${src}?w=${width}`;
}
