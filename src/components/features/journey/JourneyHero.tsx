"use client";

import { motion } from "framer-motion";
import { Plane } from "lucide-react";

const JourneyHero = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 to-slate-900">
      {/* Background with abstract map or texture */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-30" />
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-20" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full backdrop-blur-sm mb-4">
            <Plane className="w-6 h-6 text-blue-200 rotate-[-45deg]" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white tracking-tight">
            Journey History
          </h1>

          <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto font-sans font-light leading-relaxed">
            旅の記憶、足跡の記録。<br />
            訪れた場所、出会った風景、そして心に残った瞬間のアーカイブ。
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-blue-200/50 uppercase tracking-widest">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-blue-200/50 to-transparent" />
      </motion.div>
    </section>
  );
};

export default JourneyHero;
