"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Map } from "lucide-react";
import { sectionVariants } from "@/components/common/animation";

const RoadmapPromo = () => {
  return (
    <motion.section
      className="py-16 md:py-24 bg-card/50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10 text-primary">
            <Map className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-foreground">
          Future Journey
        </h2>

        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
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
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300"
          >
            ロードマップを見る
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default RoadmapPromo;
