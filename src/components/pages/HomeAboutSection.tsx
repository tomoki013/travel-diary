"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { sectionVariants } from "@/components/common/animation";
import { members } from "@/data/member";

const HomeAboutSection = () => {
  const author = members[0];

  if (!author) {
    return null;
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      className="py-20 px-6 md:px-8 max-w-4xl mx-auto"
    >
      <div className="rounded-3xl border border-border/60 bg-card/60 p-8 shadow-sm backdrop-blur-sm md:p-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <Image
            src={author.image}
            alt={author.name}
            width={112}
            height={112}
            className="rounded-full object-cover"
          />
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold tracking-[0.24em] text-muted-foreground">
              ABOUT THIS BLOG
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              ともきちの旅行日記について
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {author.description}
              旅先での空気感だけでなく、移動や予約でつまずきやすかった点まで、
              次に行く人が読みやすい形に整理して残しています。
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                href="/about"
                className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                プロフィールを見る
              </Link>
              <Link
                href="/journey"
                className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                旅の軌跡を見る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HomeAboutSection;
