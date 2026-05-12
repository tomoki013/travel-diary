"use client";

import { motion } from "framer-motion";
import { Plane } from "lucide-react";

const JourneyHero = () => {
  return (
    <section className="relative flex h-[60vh] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 md:h-[70vh]">
      {/* Background with abstract map or texture */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-30" />
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-amber-600 opacity-20 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-orange-500 opacity-20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-amber-100/10 p-3 backdrop-blur-sm">
            <Plane className="h-6 w-6 rotate-[-45deg] text-amber-200" />
          </div>

          <h1 className="font-heading text-4xl font-bold tracking-tight text-amber-50 md:text-6xl lg:text-7xl">
            Journey History
          </h1>

          <p className="mx-auto max-w-2xl font-sans text-lg leading-relaxed font-light text-stone-300 md:text-xl">
            旅の記憶、足跡の記録。
            <br />
            訪れた場所、出会った風景、そして心に残った瞬間のアーカイブ。
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest text-amber-200/50 uppercase">
          Scroll to explore
        </span>
        <div className="h-12 w-[1px] bg-gradient-to-b from-amber-200/50 to-transparent" />
      </motion.div>
    </section>
  );
};

export default JourneyHero;
