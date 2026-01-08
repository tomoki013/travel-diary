"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { sectionVariants } from "@/components/common/animation";

const JourneyTeaser = () => {
  return (
    <motion.section
      className="w-full py-16 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-card/50 border border-border/50 shadow-lg backdrop-blur-sm">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
            <div className="space-y-4 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2 border border-primary/20">
                <Map className="w-3 h-3" />
                <span>My Journey</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                これまでの旅の軌跡
              </h3>

              <p className="text-muted-foreground leading-relaxed max-w-lg">
                訪れた国々、忘れられない景色、そして旅の思い出。
                私のこれまでの冒険をタイムラインで振り返ります。
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link
                href="/journey"
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold shadow-lg hover:bg-primary/90 transition-all duration-300"
              >
                <span>軌跡を辿る</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default JourneyTeaser;
