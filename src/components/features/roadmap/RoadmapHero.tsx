"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function RoadmapHero() {
  return (
    <section className="relative flex h-[80vh] flex-col items-center justify-center p-6 text-center">
      {/* Background Decoration - utilizing site colors */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30 dark:opacity-10">
        <div className="bg-secondary/30 animate-blob absolute top-10 left-10 h-64 w-64 rounded-full mix-blend-multiply blur-3xl" />
        <div className="bg-primary/30 animate-blob animation-delay-2000 absolute top-10 right-10 h-64 w-64 rounded-full mix-blend-multiply blur-3xl" />
        <div className="bg-accent/50 animate-blob animation-delay-4000 absolute bottom-20 left-1/2 h-64 w-64 rounded-full mix-blend-multiply blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-heading text-primary mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          Updates & Roadmap
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
          ともきちの旅行日記の最新情報と、これから歩む旅のしおり。
          <br />
          新しい機能、わくわくする体験、そして未来へのマイルストーン。
          <br />
          一緒に旅を楽しみましょう。
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
      >
        <span className="font-code text-muted-foreground text-sm">Scroll to Explore</span>
        <ChevronDown className="text-primary h-6 w-6" />
      </motion.div>
    </section>
  );
}
