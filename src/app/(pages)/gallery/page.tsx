import { getAllPosts } from "@/lib/post-metadata";
import Client from "./Client";
import { Metadata } from "next";
import { getPhotos } from "@/lib/photo";

export const metadata: Metadata = {
  title: "写真ギャラリー | 気になる景色から旅先の記事へ",
  description:
    "ともきちの旅行日記の写真ギャラリーでは、気になる景色から地域の記事や旅行記へ入れます。世界各地の写真を眺めながら、次に読みたい旅先を見つけられるページです。",
  openGraph: {
    title: "写真ギャラリー | 気になる景色から旅先の記事へ",
    description:
      "ともきちの旅行日記の写真ギャラリーでは、気になる景色から地域の記事や旅行記へ入れます。世界各地の写真を眺めながら、次に読みたい旅先を見つけられるページです。",
    images: [
      {
        url: "/images/Spain/toledo-view.jpg",
        width: 1200,
        height: 630,
        alt: "ともきちの旅行日記",
      },
    ],
  },
  twitter: {
    title: "写真ギャラリー | 気になる景色から旅先の記事へ",
    description:
      "ともきちの旅行日記の写真ギャラリーでは、気になる景色から地域の記事や旅行記へ入れます。世界各地の写真を眺めながら、次に読みたい旅先を見つけられるページです。",
    images: ["/images/Spain/toledo-view.jpg"],
  },
  robots: {
    index: false,
    follow: true,
  },
};

const GalleryPage = async () => {
  const allPosts = await getAllPosts();
  const allPhotos = await getPhotos();
  return <Client posts={allPosts} photos={allPhotos} />;
};

export default GalleryPage;
