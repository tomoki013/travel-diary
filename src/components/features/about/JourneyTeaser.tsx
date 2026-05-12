"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { sectionVariants } from "@/components/common/animation";

const JourneyTeaser = () => {
  return (
    <motion.section
      className="w-full px-4 py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="mx-auto max-w-4xl">
        <div className="bg-card/50 border-border/50 relative overflow-hidden rounded-3xl border shadow-lg backdrop-blur-sm">
          <div className="relative z-10 flex flex-col items-center justify-between gap-8 p-8 md:flex-row md:p-12">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="bg-primary/10 text-primary border-primary/20 mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                <Map className="h-3 w-3" />
                <span>My Journey</span>
              </div>

              <h3 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
                これまでの旅の軌跡
              </h3>

              <p className="text-muted-foreground max-w-lg leading-relaxed">
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
                className="group bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold shadow-lg transition-all duration-300"
              >
                <span>軌跡を辿る</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default JourneyTeaser;
