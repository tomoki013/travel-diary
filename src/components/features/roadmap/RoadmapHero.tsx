"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function RoadmapHero() {
  return (
    <section className="relative h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      {/* Background Decoration - utilizing site colors */}
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-secondary/30 rounded-full blur-3xl mix-blend-multiply animate-blob" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-accent/50 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight text-primary">
          Updates & Roadmap
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ともきちの旅行日記の最新情報と、これから歩む旅のしおり。
          <br />
          新しい機能、わくわくする体験、そして未来へのマイルストーン。
          <br />
          一緒に旅を楽しみましょう。
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
      >
        <span className="text-sm font-code text-muted-foreground">
          Scroll to Explore
        </span>
        <ChevronDown className="w-6 h-6 text-primary" />
      </motion.div>
    </section>
  );
}
