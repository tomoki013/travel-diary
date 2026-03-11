import { getAllPosts } from "@/lib/post-metadata";
import Client from "./Client";
import { Metadata } from "next";
import { getPhotos } from "@/lib/photo";

export const metadata: Metadata = {
  title: "写真ギャラリー– 写真で次の旅先を見つけよう",
  description:
    "ともきちの旅行日記の「写真ギャラリー」では、世界各国の美しい風景や旅先の瞬間を切り取った写真を多数掲載。お気に入りの一枚から次に行きたい旅行先を見つけたり、旅のインスピレーションを得られるコンテンツが満載です。写真を眺めながら、あなたの次の冒険を計画してみませんか？",
  openGraph: {
    title: "写真ギャラリー– 写真で次の旅先を見つけよう",
    description:
      "ともきちの旅行日記の「写真ギャラリー」では、世界各国の美しい風景や旅先の瞬間を切り取った写真を多数掲載。お気に入りの一枚から次に行きたい旅行先を見つけたり、旅のインスピレーションを得られるコンテンツが満載です。写真を眺めながら、あなたの次の冒険を計画してみませんか？",
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
    title: "写真ギャラリー– 写真で次の旅先を見つけよう",
    description:
      "ともきちの旅行日記の「写真ギャラリー」では、世界各国の美しい風景や旅先の瞬間を切り取った写真を多数掲載。お気に入りの一枚から次に行きたい旅行先を見つけたり、旅のインスピレーションを得られるコンテンツが満載です。写真を眺めながら、あなたの次の冒険を計画してみませんか？",
    images: ["/images/Spain/toledo-view.jpg"],
  },
};

const GalleryPage = async () => {
  const allPosts = await getAllPosts();
  const allPhotos = await getPhotos();
  return <Client posts={allPosts} photos={allPhotos} />;
};

export default GalleryPage;
