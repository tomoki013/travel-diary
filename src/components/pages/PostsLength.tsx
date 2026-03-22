"use client";

import { motion } from "framer-motion";
import { sectionVariants } from "@/components/common/animation";
import { PostMetadata } from "@/types/types";
import Button from "../common/Button";

interface PostsLengthProps {
  posts: PostMetadata[];
}

const PostsLength = ({ posts }: PostsLengthProps) => {
  const postsLength = posts.length;
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      className="py-24 px-6 md:px-8 max-w-5xl mx-auto"
    >
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          これまでの旅の記録
        </h2>
        <div className="w-24 h-0.5 bg-secondary mx-auto mt-6" />
      </div>
      <div className="text-center mt-8 mb-12 flex flex-col items-center gap-2">
        <p className="text-muted-foreground text-sm font-medium tracking-wide">POSTS</p>
        <p className="text-xl md:text-2xl font-bold">
          <span className="text-5xl md:text-6xl text-primary font-extrabold tracking-tighter">
            {postsLength}
          </span>
          <span className="ml-2 text-xl text-muted-foreground font-normal">記事</span>
        </p>
      </div>
      <Button href={`/posts`}>すべての記事を見る</Button>
    </motion.section>
  );
};

export default PostsLength;
