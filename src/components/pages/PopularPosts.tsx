"use client";

import PostCard from "@/components/common/PostCard";
import { motion } from "framer-motion";
import { sectionVariants, staggerContainer } from "@/components/common/animation";
import { Post } from "@/types/types";
type PostMetadata = Omit<Post, "content">;

interface PopularPostsProps {
  posts: PostMetadata[];
}

const PopularPosts = ({ posts }: PopularPostsProps) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      className="mx-auto max-w-5xl px-6 py-24 md:px-8"
    >
      {/* セクションタイトル */}
      <div className="mb-16 text-center">
        <h2 className="font-heading text-foreground text-4xl font-bold md:text-5xl">
          Popular Posts
        </h2>
        {/* タイトル下のアクセントライン */}
        <div className="bg-secondary mx-auto mt-6 h-0.5 w-30"></div>
      </div>

      {/* 記事一覧 */}
      <motion.div className="flex flex-col gap-16 md:gap-20" variants={staggerContainer()}>
        {posts.slice(0, 2).map((post, index) => (
          <motion.div
            key={post.slug}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <PostCard
              post={post}
              isReversed={index % 2 !== 0} // 偶数番目と奇数番目でレイアウトを反転
              showMetadata={false} // メタデータを表示
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default PopularPosts;
