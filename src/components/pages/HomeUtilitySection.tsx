"use client";

import { motion } from "framer-motion";
import { sectionVariants } from "@/components/common/animation";
import GlobePromo from "@/components/features/promo/GlobePromo";

const HomeUtilitySection = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      className="mx-auto max-w-6xl px-6 py-24 md:px-8"
    >
      <div className="mb-10 text-center">
        <p className="text-muted-foreground text-sm font-semibold tracking-[0.24em]">UTILITIES</p>
        <h2 className="font-heading text-foreground mt-3 text-4xl font-bold md:text-5xl">
          記事の次に使える補助機能
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-3xl leading-relaxed">
          記事で気になった旅先を見つけたあとに、その地域の位置関係や広がりを把握しやすい補助機能をまとめています。
        </p>
      </div>

      <div className="grid gap-6">
        <GlobePromo compact className="px-0" />
      </div>
    </motion.section>
  );
};

export default HomeUtilitySection;
