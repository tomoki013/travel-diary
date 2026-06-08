"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "../common/Button";

import { sectionVariants } from "../common/animation";

type GalleryPhoto = { path: string; title: string };

// Swiper を廃し、framer-motion による連続マーキーで写真を自動横スクロールさせる。
// items を2回描画し x を 0%↔-50% で動かすことでシームレスにループする。
const MarqueeRow = ({
  items,
  direction = "left",
  priorityCount = 0,
}: {
  items: GalleryPhoto[];
  direction?: "left" | "right";
  priorityCount?: number;
}) => {
  const loopItems = [...items, ...items];
  // 1枚あたり約3秒のペースでゆっくりスクロール。
  const duration = Math.max(items.length, 1) * 3;
  const keyframes = direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        className="flex w-max gap-4 md:gap-5 lg:gap-6"
        animate={{ x: keyframes }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {loopItems.map((item, index) => (
          <div
            key={`${item.path}-${index}`}
            className="h-[268px] w-[260px] shrink-0 overflow-hidden rounded-md md:w-[300px] lg:w-[360px]"
          >
            <Image
              src={item.path}
              alt={item.title}
              width={400}
              height={300}
              className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
              priority={index < priorityCount}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const photos = [
  {
    path: "/images/Singapore/views-around-marina-bay-sands-and-the-merlion.jpg",
    title: "マリーナベイサンズとマーライオン周辺の景色",
  },
  {
    path: "/images/Malaysia/petronas-twin-towers.jpg",
    title: "ペトロナスツインタワー",
  },
  {
    path: "/images/China/yuen-garden-illuminated-at-night.jpg",
    title: "豫園の夜景",
  },
  { path: "/images/China/the-night-view-of-the-bund.jpg", title: "外灘の夜景" },
  { path: "/images/Belgium/chez-leon-carbonade.jpg", title: "カルボナード" },
  {
    path: "/images/Belgium/galeries-royales-saint-hubert.jpg",
    title: "ギャルリ・サン・テュベール",
  },
  { path: "/images/Egypt/abusimbel-temple.jpg", title: "アブシンベル神殿" },
  {
    path: "/images/Egypt/the-three-great-pyramids-of-giza-with-sunset.jpg",
    title: "ギザの三大ピラミッドと夕陽",
  },
  {
    path: "/images/France/arc-de-triomphe-etoile.jpg",
    title: "エトワール凱旋門",
  },
  {
    path: "/images/France/bonaparte-over-the-saint-bernard-pass.jpg",
    title: "ナポレオンの絵",
  },
  {
    path: "/images/France/carrette-macarons-and-chocolate-mousse.jpg",
    title: "カフェ-カレット",
  },
  {
    path: "/images/France/eiffel-tower-and-sunset.jpg",
    title: "夕陽とエッフェル塔",
  },
  {
    path: "/images/France/escargot-at-le-vieux-bistrot.jpg",
    title: "エスカルゴ",
  },
  { path: "/images/France/louvre-museum1.jpg", title: "ルーブル美術館" },
  { path: "/images/France/mona-lisa.jpg", title: "モナリザ" },
  {
    path: "/images/France/the-hall-of-mirrors.jpg",
    title: "ヴェルサイユ宮殿・鏡の間",
  },
  { path: "/images/Greece/oia-castle-sunset-view.jpg", title: "イアの夕陽" },
  { path: "/images/Greece/oia-castle-view.jpg", title: "イア城跡からの景色" },
  { path: "/images/Greece/parthenon.jpg", title: "パルテノン神殿" },
  { path: "/images/India/hawa-mahal.jpg", title: "ハワー・マハル" },
  { path: "/images/India/indian-curry1.jpg", title: "インドカレー" },
  { path: "/images/India/lotus-temple.jpg", title: "ロータス寺院" },
  { path: "/images/India/tajmahal.jpg", title: "タージ・マハル" },
  {
    path: "/images/India/train-view1.jpg",
    title: "インドの寝台列車からの景色",
  },
  {
    path: "/images/Kyoto/kiyomizu-temple-autumn-leaves-lightup.jpg",
    title: "清水寺の紅葉ライトアップ",
  },
  {
    path: "/images/Spain/casa-loleas-dry-cured-ham.jpg",
    title: "パ・アンブ・トマケ",
  },
  {
    path: "/images/Spain/la-pallaresas-churos-con-chocolatte.jpg",
    title: "チュロス・コン・チョコラテ",
  },
  { path: "/images/Spain/plaza-de-mayor.jpg", title: "マヨール広場" },
  { path: "/images/Spain/sagrada-familia.jpg", title: "サグラダ・ファミリア" },
  { path: "/images/Spain/toledo-view.jpg", title: "トレド旧市街の絶景" },
  {
    path: "/images/Thai/ceiling-at-wat-pak-nam.jpg",
    title: "ワット・パクナムの仏塔",
  },
  { path: "/images/Thai/tom-yum-goong.jpg", title: "トムヤムクン" },
  {
    path: "/images/Thai/wat-arun-right-up.jpg",
    title: "ライトアップされたワット・アルン",
  },
  {
    path: "/images/Thai/wat-arun-with-sunset.jpg",
    title: "夕陽とワット・アルン",
  },
  {
    path: "/images/Turkey/balloons-in-cappadocia.jpg",
    title: "balloons in cappadocia",
  },
];

interface GalleryProps {
  teaser?: boolean;
}

const Gallery = ({ teaser = false }: GalleryProps) => {
  // 変更点 3: ギャラリーデータを上段用（偶数インデックス）と下段用（奇数インデックス）に分割
  const topRowGallery = photos.filter((_, index) => index % 2 === 0);
  const bottomRowGallery = photos.filter((_, index) => index % 2 !== 0);
  const visibleTopGallery = teaser ? topRowGallery.slice(0, 12) : topRowGallery;
  const visibleBottomGallery = teaser ? bottomRowGallery.slice(0, 12) : bottomRowGallery;

  return (
    <motion.section
      id="gallery"
      className={teaser ? "py-16" : "py-24"}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >
      {/* セクションタイトル */}
      <div className="mb-16 px-6 text-center md:px-8">
        <h2 className="font-heading text-foreground text-4xl font-bold md:text-5xl">
          {teaser ? "写真から旅先を見つける" : "Gallery"}
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl leading-relaxed">
          {teaser
            ? "気になる景色が見つかったら、そのまま地域の記事や旅行記へ入っていけます。"
            : "これまでの旅で撮った写真から、気になる地域の記事や旅行記へつながれるギャラリーです。"}
        </p>
        <div className="bg-secondary mx-auto mt-6 h-0.5 w-30" />
      </div>

      {/* 2段のマーキーを縦に並べる。上段は右→左、下段は左→右へ流れる。 */}
      <div className="mx-auto flex max-w-6xl flex-col space-y-6 px-4">
        {/* --- 上の段 (右から左へ) --- */}
        <MarqueeRow items={visibleTopGallery} direction="left" priorityCount={3} />

        {/* --- 下の段 (左から右へ) --- */}
        <MarqueeRow items={visibleBottomGallery} direction="right" priorityCount={3} />
      </div>

      {/* ボタン */}
      <Button href={`/gallery`}>
        {teaser ? "写真から記事を探す" : "写真から旅先の記事を探す"}
      </Button>
    </motion.section>
  );
};

export default Gallery;
