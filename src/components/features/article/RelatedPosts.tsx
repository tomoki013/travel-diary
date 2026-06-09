import { Post } from "@/types/types";
type PostMetadata = Omit<Post, "content">;
import PostCard from "@/components/common/PostCard";
import { Reveal, RevealStagger } from "@/components/common/Reveal";
import { fadeIn } from "@/components/common/animation";

interface RelatedPostsProps {
  posts: PostMetadata[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <Reveal as="section" className="mt-12" amount={0.2}>
      <h2 className="text-foreground mb-2 text-center text-2xl font-bold sm:text-left">
        次に読むなら
      </h2>
      <p className="text-muted-foreground mb-6 text-center text-sm sm:text-left">
        同じ都市や国、近い準備フェーズの記事を優先して並べています。
      </p>
      <RevealStagger className="grid gap-5">
        {posts.map((post) => (
          <Reveal key={post.slug} variants={fadeIn()}>
            <PostCard post={post} variant="relate" layout="horizontal" />
          </Reveal>
        ))}
      </RevealStagger>
    </Reveal>
  );
};

export default RelatedPosts;
