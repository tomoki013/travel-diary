import PostCard from "@/components/common/PostCard";
import Button from "../common/Button";
import { Reveal, RevealStagger } from "@/components/common/Reveal";
import { Post } from "@/types/types";
type PostMetadata = Omit<Post, "content">;

interface NewPostsProps {
  posts: PostMetadata[];
}

const NewPosts = ({ posts }: NewPostsProps) => {
  return (
    <Reveal as="section" className="mx-auto max-w-5xl px-6 py-24 md:px-8">
      {/* セクションタイトル */}
      <div className="mb-16 text-center">
        <h2 className="font-heading text-foreground text-4xl font-bold md:text-5xl">New Posts</h2>
        {/* タイトル下のアクセントライン */}
        <div className="bg-secondary mx-auto mt-6 h-0.5 w-30" />
      </div>

      {/* 記事一覧 */}
      <RevealStagger className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
        {posts.slice(0, 6).map((post) => (
          <Reveal key={post.slug}>
            <PostCard post={post} />
          </Reveal>
        ))}
      </RevealStagger>

      {/* ボタン */}
      <Button href={`/posts`}>ブログ一覧を見る</Button>
    </Reveal>
  );
};

export default NewPosts;
