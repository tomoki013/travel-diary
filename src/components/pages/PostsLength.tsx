import { Reveal } from "@/components/common/Reveal";
import { PostMetadata } from "@/types/types";
import Button from "../common/Button";

interface PostsLengthProps {
  posts: PostMetadata[];
}

const PostsLength = ({ posts }: PostsLengthProps) => {
  const postsLength = posts.length;
  return (
    <Reveal as="section" className="mx-auto max-w-5xl px-6 py-24 md:px-8">
      <div className="mb-16 text-center">
        <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
          これまでの旅の記録
        </h2>
        <div className="bg-secondary mx-auto mt-6 h-0.5 w-24" />
      </div>
      <div className="mt-8 mb-12 flex flex-col items-center gap-2 text-center">
        <p className="text-muted-foreground text-sm font-medium tracking-wide">POSTS</p>
        <p className="text-xl font-bold md:text-2xl">
          <span className="text-primary text-5xl font-extrabold tracking-tighter md:text-6xl">
            {postsLength}
          </span>
          <span className="text-muted-foreground ml-2 text-xl font-normal">記事</span>
        </p>
      </div>
      <Button href={`/posts`}>すべての記事を見る</Button>
    </Reveal>
  );
};

export default PostsLength;
