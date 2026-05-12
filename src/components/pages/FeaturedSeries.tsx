"use client";

import { featuredSeries } from "@/data/series";
import SeriesCard from "../common/SeriesCard";
import Button from "../common/Button";
import { motion } from "framer-motion";
import { sectionVariants, staggerContainer } from "@/components/common/animation";

const FeaturedSeries = () => {
  return (
    <motion.section
      className="mx-auto max-w-6xl px-6 py-24 md:px-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >
      {/* セクションタイトル */}
      <div className="mb-16 text-center">
        <h2 className="font-heading text-foreground text-4xl font-bold md:text-5xl">
          Featured Series
        </h2>
        <div className="bg-secondary mx-auto mt-6 h-0.5 w-30"></div>
      </div>

      {/* カードグリッド */}
      <motion.div
        className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer()}
      >
        {featuredSeries.slice(0, 6).map((series) => (
          <motion.div
            key={series.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <SeriesCard series={series} />
          </motion.div>
        ))}
      </motion.div>

      {/* ボタン */}
      <Button href={`/series`}>シリーズ一覧を見る</Button>
    </motion.section>
  );
};

export default FeaturedSeries;
