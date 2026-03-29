"use client";

import Link from "next/link";
import { featuredSeries } from "@/data/series";

interface PostLink {
  href: string;
  title: string;
}

interface PostNavigationProps {
  previousPost?: PostLink;
  nextPost?: PostLink;
  previousCategoryPost?: PostLink;
  nextCategoryPost?: PostLink;
  previousSeriesPost?: PostLink;
  nextSeriesPost?: PostLink;
  series?: string;
  category?: string;
}

const NavigationLinks = ({
  previousPost,
  nextPost,
}: {
  previousPost?: PostLink;
  nextPost?: PostLink;
}) => {
  // Per user request: Previous on the left, Next on the right.
  return (
    <div className="flex justify-between border-y border-gray-200 py-6">
      {previousPost ? (
        <Link
          href={previousPost.href}
          className="text-foreground hover:text-secondary max-w-[45%]"
        >
          <span className="text-sm">« 前の記事へ</span>
          <p className="font-semibold truncate">{previousPost.title}</p>
        </Link>
      ) : (
        <div />
      )}
      {nextPost ? (
        <Link
          href={nextPost.href}
          className="text-foreground hover:text-secondary max-w-[45%] text-right"
        >
          <span className="text-sm">次の記事へ »</span>
          <p className="font-semibold truncate">{nextPost.title}</p>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
};

const PostNavigation = ({
  previousPost,
  nextPost,
  previousSeriesPost,
  nextSeriesPost,
  series,
}: PostNavigationProps) => {
  const showSeriesNav = previousSeriesPost || nextSeriesPost;

  const seriesTitle = featuredSeries.find((s) => s.slug === series)?.title;

  return (
    <div className="mb-10 space-y-12">
      {showSeriesNav && (
        <div>
          <h3 className="text-center font-semibold mb-4">
            ▼ シリーズ「{seriesTitle}」の続きを読む ▼
          </h3>
          <NavigationLinks
            previousPost={previousSeriesPost}
            nextPost={nextSeriesPost}
          />
        </div>
      )}

      <div>
        <h3 className="text-center font-semibold mb-4">▼ 前後の記事を読む ▼</h3>
        <NavigationLinks previousPost={previousPost} nextPost={nextPost} />
      </div>
    </div>
  );
};

export default PostNavigation;
