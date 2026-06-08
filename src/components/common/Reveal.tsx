"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { sectionVariants, staggerContainer } from "./animation";

/**
 * スクロールで一度だけフェードインする薄い client ラッパー。
 *
 * これを使うことで、アニメーションだけを client 側に閉じ込め、
 * 中身（データ取得・マークアップ）は Server Component のまま渡せる。
 *
 *   <Reveal as="section" className="...">...server children...</Reveal>
 *   <RevealStagger>{items.map(i => <Reveal key=...>...</Reveal>)}</RevealStagger>
 */

type RevealTag = "div" | "section" | "header" | "article" | "ul" | "li";

type RevealProps = React.ComponentProps<typeof motion.div> & {
  as?: RevealTag;
  /** IntersectionObserver の発火しきい値（既定 0.1）。 */
  amount?: number;
  variants?: Variants;
};

export function Reveal({
  as = "div",
  amount = 0.1,
  variants = sectionVariants,
  ...props
}: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      {...props}
    />
  );
}

type RevealStaggerProps = RevealProps & {
  staggerChildren?: number;
  delayChildren?: number;
};

export function RevealStagger({
  staggerChildren = 0.1,
  delayChildren = 0,
  ...props
}: RevealStaggerProps) {
  return <Reveal variants={staggerContainer(staggerChildren, delayChildren)} {...props} />;
}
