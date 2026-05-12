"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Map } from "lucide-react";
import { sectionVariants } from "@/components/common/animation";

const RoadmapPromo = () => {
  return (
    <motion.section
      className="bg-card/50 py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 text-primary rounded-full p-4">
            <Map className="h-8 w-8" />
          </div>
        </div>

        <h2 className="font-heading text-foreground mb-6 text-3xl font-bold md:text-4xl">
          Future Journey
        </h2>

        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg leading-relaxed">
          「ともきちの旅行日記」は、まだ始まったばかり。
          <br />
          これから実装予定の機能や、未来の構想を「ロードマップ」として公開しています。
          私たちの旅の計画を、ぜひ覗いてみてください。
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/roadmap"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-bold shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            ロードマップを見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default RoadmapPromo;
