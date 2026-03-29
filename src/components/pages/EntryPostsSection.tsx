"use client";

import { motion } from "framer-motion";
import { Post } from "@/types/types";
import PostCard from "@/components/common/PostCard";
import Button from "@/components/common/Button";
import {
  sectionVariants,
  staggerContainer,
} from "@/components/common/animation";

type PostMetadata = Omit<Post, "content">;

interface EntryPostsSectionProps {
  posts: PostMetadata[];
}

const EntryPostsSection = ({ posts }: EntryPostsSectionProps) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      className="py-24 px-6 md:px-8 max-w-6xl mx-auto"
    >
      <div className="text-center mb-16">
        <p className="text-sm font-semibold tracking-[0.24em] text-orange-600 dark:text-amber-300">
          START HERE
        </p>
        <h2 className="mt-3 font-heading text-4xl md:text-5xl font-bold text-foreground">
          まずはここから
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground leading-relaxed">
          初めて読む人でも入りやすい記事を、実用性を優先して並べました。
          空港アクセスや現地移動、旅の全体像から読み始めるのがおすすめです。
        </p>
      </div>

      <motion.div
        variants={staggerContainer()}
        className="grid grid-cols-1 gap-8 md:grid-cols-2"
      >
        {posts.map((post) => (
          <motion.div
            key={post.slug}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <PostCard post={post} showDiscoveryNote />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12">
        <Button href="/posts?view=recommended">おすすめ記事をもっと見る</Button>
      </div>
    </motion.section>
  );
};

export default EntryPostsSection;
