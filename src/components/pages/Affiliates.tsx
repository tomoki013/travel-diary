"use client";

import { motion } from "framer-motion";
import { sectionVariants, staggerContainer } from "../common/animation";
import { affiliates } from "@/constants/affiliates";
import AffiliateCard from "../common/AffiliateCard";
import { ENABLE_AFFILIATES } from "@/constants/site";

const Affiliates = () => {
  if (!ENABLE_AFFILIATES) return null;

  const appsToShow = affiliates.filter((aff) => aff.status === "ready");

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      className="py-24 px-6 md:px-8 max-w-5xl mx-auto"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            旅の予約におすすめのサイト・アプリ
          </h2>
          <p className="text-muted-foreground mt-2">
            旅行の準備がもっと楽しく、スムーズになる予約ツールを集めました。
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start"
          variants={staggerContainer()}
        >
          {appsToShow.map((app) => (
            <motion.div
              key={app.affiliateUrl}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={sectionVariants}
              className={app.type === "banner" ? "md:col-span-2 lg:col-span-3" : ""}
            >
              <AffiliateCard affiliate={app} type={app.type} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Affiliates;
