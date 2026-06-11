import type { Metadata } from "next";

type OpenGraphImages = NonNullable<Metadata["openGraph"]> extends { images?: infer T } ? T : never;

interface PageMetadataOptions {
  title: string;
  description: string;
  /** canonical・OGP URL に使うルート相対パス(例: "/about")。 */
  path: string;
  /** SNSカード用の説明文。省略時は description を使う。 */
  socialDescription?: string;
  /** OGP画像。省略時はルートレイアウトのデフォルト画像を継承する。 */
  images?: OpenGraphImages;
  /** 検索エンジンにインデックスさせないページは true。 */
  noindex?: boolean;
}

/**
 * 静的ページ用の Metadata を生成する。
 *
 * - canonical を必ずページ自身のパスに設定する(ルートレイアウトに
 *   canonical を置くと全ページがトップページ扱いになる事故の再発防止)。
 * - title / description を openGraph / twitter へ重複記述しなくて済むようにする。
 */
export function createPageMetadata({
  title,
  description,
  path,
  socialDescription,
  images,
  noindex,
}: PageMetadataOptions): Metadata {
  const social = socialDescription ?? description;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description: social,
      url: path,
      ...(images ? { images } : {}),
    },
    twitter: {
      title,
      description: social,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
