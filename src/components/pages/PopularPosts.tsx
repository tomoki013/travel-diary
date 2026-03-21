"use client";

import PostCard from "@/components/common/PostCard";
import { motion } from "framer-motion";
import { sectionVariants, staggerContainer } from "@/components/common/animation";
import { Post } from "@/types/types";

type PostMetadata = Omit<Post, "content">;

interface PopularPostsProps {
  posts: PostMetadata[];
  title?: string;
  description?: string;
  limit?: number;
}

const PopularPosts = ({
  posts,
  title = "Popular Posts",
  description,
  limit = 2,
}: PopularPostsProps) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      className="py-24 px-6 md:px-8 max-w-5xl mx-auto"
    >
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {description}
          </p>
        )}
        <div className="w-30 h-0.5 bg-secondary mx-auto mt-6"></div>
      </div>

      <motion.div
        className="flex flex-col gap-16 md:gap-20"
        variants={staggerContainer()}
      >
        {posts.slice(0, limit).map((post, index) => (
          <motion.div
            key={post.slug}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <PostCard
              post={post}
              isReversed={index % 2 !== 0}
              showMetadata={false}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default PopularPosts;
