"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Region, Post, AllDestinationProps } from "@/types/types";
type PostMetadata = Omit<Post, "content">;
import PostCard from "@/components/common/PostCard";
import {
  sectionVariants,
  slideFadeIn,
  staggerContainer,
} from "@/components/common/animation";
import { Wind } from "lucide-react";
import AllDestination from "@/components/features/destination/allDestination";
import GlobePromo from "@/components/features/promo/GlobePromo";

interface ClientProps extends AllDestinationProps {
  region: Region;
  seriesPosts: PostMetadata[];
  tourismPosts: PostMetadata[];
  itineraryPosts: PostMetadata[];
  oneOffPosts: PostMetadata[];
}

const Client = ({
  region,
  seriesPosts,
  tourismPosts,
  itineraryPosts,
  oneOffPosts,
  regionData,
}: ClientProps) => {
  const noPosts =
    seriesPosts.length === 0 &&
    tourismPosts.length === 0 &&
    itineraryPosts.length === 0 &&
    oneOffPosts.length === 0;

  const country = regionData
    .flatMap((continent) => continent.countries)
    .find((c) => c.slug === region.slug);

  const hasChildren =
    country && country.children && country.children.length > 0;

  return (
    <div>
      {/* ==================== Hero Section ==================== */}
      <section className="relative h-80 md:h-96 flex items-center justify-center text-white/80 text-center">
        <Image
          src={region.imageURL}
          alt={region.name}
          fill
          objectFit="cover"
          className="brightness-50"
          priority
        />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">
            {region.slug} - {region.name}
          </h1>
        </div>
      </section>

      {/* ==================== Child Regions Section ==================== */}
      {hasChildren && country?.children && (
        <motion.section
          className="bg-background"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              この国のエリア
            </h2>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
              variants={staggerContainer(0.1, 0.1)}
            >
              {country.children.map((child) => (
                <motion.div
                  key={child.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={sectionVariants}
                >
                  <Link
                    href={`/destination/${child.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={child.imageURL}
                        alt={child.name}
                        fill
                        objectFit="cover"
                        className="transform transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 transition-colors duration-300" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-center text-foreground group-hover:text-primary transition-colors duration-300">
                      {child.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {noPosts ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={slideFadeIn()}
            className="text-center bg-background border-2 border-dashed border-slate-300 rounded-xl p-8 md:p-12"
          >
            <div className="flex justify-center mb-4">
              <Wind className="w-16 h-16 text-slate-400" strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              まだ何もない場所
            </h3>
            <p className="mt-2 text-foreground max-w-md mx-auto">
              この地域に関する記事は現在準備中です。
              <br />
              新しい冒険の記録が追加されるのをお楽しみに！
            </p>
          </motion.div>
        ) : (
          <div className="space-y-16">
            {/* ==================== イントロダクション ==================== */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={sectionVariants}
            >
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <p className="text-xl md:text-2xl font-medium text-foreground">
                  {region.name}の旅行ガイド・記
                </p>
                {region.description ? (
                  <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
                    {region.description}
                  </p>
                ) : (
                  <p className="text-lg text-foreground leading-relaxed">
                    {region.name}
                    の旅で役立つ情報や、旅の記録をまとめました。あなたの次の冒険の参考にしてください。
                  </p>
                )}
              </div>
            </motion.section>

            {/* ==================== 関連シリーズセクション ==================== */}
            {seriesPosts.length > 0 && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
              >
                <h2 className="text-3xl font-bold text-center mb-8">
                  この地域が登場するシリーズ記事
                </h2>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  variants={staggerContainer()}
                >
                  {seriesPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={sectionVariants}
                    >
                      <PostCard
                        post={post}
                        isReversed={index % 2 !== 0}
                        showMetadata
                        variant="relate"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* ==================== 観光情報セクション ==================== */}
            {tourismPosts.length > 0 && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={sectionVariants}
              >
                <h2 className="text-3xl font-bold text-center mb-8">
                  観光情報 - Tourist Information
                </h2>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={staggerContainer()}
                >
                  {tourismPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={sectionVariants}
                    >
                      <PostCard
                        post={post}
                        isReversed={index % 2 !== 0}
                        showMetadata
                        variant="relate"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* ==================== 旅程&費用セクション ==================== */}
            {itineraryPosts.length > 0 && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
              >
                <h2 className="text-3xl font-bold text-center mb-8">
                  旅程&費用 - Itinerary & Cost
                </h2>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={staggerContainer()}
                >
                  {itineraryPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={sectionVariants}
                    >
                      <PostCard
                        post={post}
                        isReversed={index % 2 !== 0}
                        showMetadata
                        variant="relate"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* ==================== 単発企画セクション ==================== */}
            {oneOffPosts.length > 0 && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
              >
                <h2 className="text-3xl font-bold text-center mb-8">
                  単発企画 - one-off project
                </h2>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={staggerContainer()}
                >
                  {oneOffPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={sectionVariants}
                    >
                      <PostCard
                        post={post}
                        isReversed={index % 2 !== 0}
                        showMetadata
                        variant="relate"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}
          </div>
        )}
      </div>
      <GlobePromo
        className="max-w-5xl mx-auto"
        queryParams={
          country
            ? { country: region.slug }
            : { region: region.slug }
        }
      />

      <div className="mt-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          全ての旅行先を見る
        </h2>
        <AllDestination
          regionData={regionData}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          countryStyle="border-b-2 border-secondary"
        />
      </div>
    </div>
  );
};

export default Client;
