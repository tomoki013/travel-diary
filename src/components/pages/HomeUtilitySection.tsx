"use client";

import { motion } from "framer-motion";
import { sectionVariants } from "@/components/common/animation";
import AIPlannerHero from "@/components/pages/AIPlannerHero";
import GlobePromo from "@/components/features/promo/GlobePromo";

const HomeUtilitySection = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      className="py-24 px-6 md:px-8 max-w-6xl mx-auto"
    >
      <div className="text-center mb-10">
        <p className="text-sm font-semibold tracking-[0.24em] text-muted-foreground">
          UTILITIES
        </p>
        <h2 className="mt-3 font-heading text-4xl md:text-5xl font-bold text-foreground">
          旅をもっと楽しむ機能
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground leading-relaxed">
          まずは記事で旅先を掴み、そのあとでプラン作成や地図確認に使える補助機能をまとめています。
        </p>
      </div>

      <div className="grid gap-6">
        <AIPlannerHero compact />
        <GlobePromo compact className="px-0" />
      </div>
    </motion.section>
  );
};

export default HomeUtilitySection;
