"use client";

import { motion } from "framer-motion";
import { Post } from "@/types/types";
import PostCard from "@/components/common/PostCard";
import Button from "@/components/common/Button";
import { sectionVariants, staggerContainer } from "@/components/common/animation";

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
      className="mx-auto max-w-6xl px-6 py-24 md:px-8"
    >
      <div className="mb-16 text-center">
        <p className="text-sm font-semibold tracking-[0.24em] text-orange-600 dark:text-amber-300">
          START HERE
        </p>
        <h2 className="font-heading text-foreground mt-3 text-4xl font-bold md:text-5xl">
          まずはここから
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-3xl leading-relaxed">
          初めて読む人でも入りやすい記事を、実用性を優先して並べました。
          空港アクセスや現地移動、旅の全体像から読み始めるのがおすすめです。
        </p>
      </div>

      <motion.div variants={staggerContainer()} className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
