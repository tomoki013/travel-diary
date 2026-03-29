"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// 変更点 1: Gridモジュールを削除し、Autoplayのみインポート
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// 変更点 2: Grid用のCSSインポートを削除
import "swiper/css";
import Button from "../common/Button";

import { sectionVariants } from "../common/animation";

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
      <div className="text-center mb-16 px-6 md:px-8">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
          {teaser ? "写真から旅先を見つける" : "Gallery"}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
          {teaser
            ? "気になる景色が見つかったら、そのまま地域の記事や旅行記へ入っていけます。"
            : "これまでの旅で撮った写真から、気になる地域の記事や旅行記へつながれるギャラリーです。"}
        </p>
        <div className="w-30 h-0.5 bg-secondary mx-auto mt-6" />
      </div>

      {/* スライダー全体の幅を制御するためのコンテナ */}
      {/* 変更点 4: 2つのスライダーを縦に並べるためのコンテナを追加 */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col space-y-6">
        {/* --- 上の段のスライダー (右から左へ) --- */}
        <Swiper
          modules={[Autoplay]}
          loop={true}
          // こちらは通常方向のまま
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            reverseDirection: true, // 右から左へスクロール
          }}
          speed={1500}
          slidesPerView={3}
          slidesPerGroup={3}
          spaceBetween={24}
          grabCursor={true}
          className="w-full h-[268px]"
          breakpoints={{
            320: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 24,
            },
          }}
        >
          {visibleTopGallery.map((item) => (
            <SwiperSlide key={item.path}>
              <motion.div
                className="overflow-hidden rounded-md h-full"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Image
                  src={item.path}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                  priority={visibleTopGallery.indexOf(item) < 3}
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {!teaser && (
          <Swiper
            modules={[Autoplay]}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            speed={1500}
            slidesPerView={3}
            slidesPerGroup={3}
            spaceBetween={24}
            grabCursor={true}
            className="w-full h-[268px]"
            breakpoints={{
              320: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 24,
              },
            }}
          >
            {visibleBottomGallery.map((item) => (
              <SwiperSlide key={item.path}>
                <motion.div
                  className="overflow-hidden rounded-md h-full"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Image
                    src={item.path}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                    priority={visibleBottomGallery.indexOf(item) < 3}
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* ボタン */}
      <Button href={`/gallery`}>
        {teaser ? "写真から記事を探す" : "写真から旅先の記事を探す"}
      </Button>
    </motion.section>
  );
};

export default Gallery;
