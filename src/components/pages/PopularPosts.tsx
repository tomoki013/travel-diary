import PostCard from "@/components/common/PostCard";
import { Reveal, RevealStagger } from "@/components/common/Reveal";
import { Post } from "@/types/types";
type PostMetadata = Omit<Post, "content">;

interface PopularPostsProps {
  posts: PostMetadata[];
}

const PopularPosts = ({ posts }: PopularPostsProps) => {
  return (
    <Reveal as="section" className="mx-auto max-w-5xl px-6 py-24 md:px-8">
      {/* セクションタイトル */}
      <div className="mb-16 text-center">
        <h2 className="font-heading text-foreground text-4xl font-bold md:text-5xl">
          Popular Posts
        </h2>
        {/* タイトル下のアクセントライン */}
        <div className="bg-secondary mx-auto mt-6 h-0.5 w-30"></div>
      </div>

      {/* 記事一覧 */}
      <RevealStagger className="flex flex-col gap-16 md:gap-20">
        {posts.slice(0, 2).map((post, index) => (
          <Reveal key={post.slug}>
            <PostCard
              post={post}
              isReversed={index % 2 !== 0} // 偶数番目と奇数番目でレイアウトを反転
              showMetadata={false} // メタデータを表示
            />
          </Reveal>
        ))}
      </RevealStagger>
    </Reveal>
  );
};

export default PopularPosts;
