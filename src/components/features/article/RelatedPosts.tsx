"use client";

import { Post } from "@/types/types";
type PostMetadata = Omit<Post, "content">;
import PostCard from "@/components/common/PostCard";
import { motion } from "framer-motion";
import {
  fadeIn,
  sectionVariants,
  staggerContainer,
} from "@/components/common/animation";

interface RelatedPostsProps {
  posts: PostMetadata[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="mt-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-left">
        次に読むなら
      </h2>
      <p className="mb-6 text-center text-sm text-muted-foreground sm:text-left">
        同じ都市や国、近い準備フェーズの記事を優先して並べています。
      </p>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer()}
        className="grid gap-5"
      >
        {posts.map((post) => (
          <motion.div
            key={post.slug}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeIn()}
          >
            <PostCard post={post} variant="relate" layout="horizontal" />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default RelatedPosts;
