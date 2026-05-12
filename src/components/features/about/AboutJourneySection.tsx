"use client";

import { motion } from "framer-motion";
import { sectionVariants } from "@/components/common/animation";

const AboutJourneySection = () => {
  return (
    <motion.section
      className="py-20 md:py-28"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <div className="text-foreground mx-auto max-w-4xl px-6">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
          この旅について - About this Journey
        </h2>
        <p className="text-center text-base leading-relaxed md:text-lg">
          「次の冒険は、どこへ？」 <br />
          ふと、そんな言葉が頭に浮かんだ時、新しい旅が始まります。このブログは、私自身が旅の計画を立てる時のワクワク感や、現地で出会った息をのむような絶景、そして旅先での小さな発見を共有するために始めました。読者の皆さんの冒険心を刺激し、次の旅への一歩を踏み出すきっかけになれたら、これ以上嬉しいことはありません。
        </p>
      </div>
    </motion.section>
  );
};

export default AboutJourneySection;
