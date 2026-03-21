"use client";

import PostCard from "@/components/common/PostCard";
import Button from "../common/Button";
import { motion } from "framer-motion";
import {
  sectionVariants,
  staggerContainer,
} from "@/components/common/animation";
import { Post } from "@/types/types";

type PostMetadata = Omit<Post, "content">;

interface NewPostsProps {
  posts: PostMetadata[];
  title?: string;
  description?: string;
  buttonHref?: string;
  buttonLabel?: string;
  limit?: number;
}

const NewPosts = ({
  posts,
  title = "New Posts",
  description,
  buttonHref = "/posts",
  buttonLabel = "ブログ一覧を見る",
  limit = 6,
}: NewPostsProps) => {
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
        <div className="w-30 h-0.5 bg-secondary mx-auto mt-6" />
      </div>

      <motion.div
        variants={staggerContainer()}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-12"
      >
        {posts.slice(0, limit).map((post) => (
          <motion.div
            key={post.slug}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </motion.div>

      <Button href={buttonHref}>{buttonLabel}</Button>
    </motion.section>
  );
};

export default NewPosts;
