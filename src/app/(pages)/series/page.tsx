import { Metadata } from "next";
import Client from "./Client";
import { getAllPosts } from "@/lib/post-metadata";
import { featuredSeries } from "@/data/series";
import SeriesCard from "@/components/features/series/SeriesCard";

export const metadata: Metadata = {
  title: "テーマで旅を深掘り - Series",
  description:
    "「ともきちの旅行日記」の連載企画（シリーズ）を一覧でご紹介。「世界の夕陽から」[cite: 54]や「絶景建築編」[cite: 55]など、特定のテーマで旅の記録を深掘りできます。あなたの好奇心を刺激する物語を見つけてください。",
  robots: {
    index: false,
    follow: true,
  },
};

const SeriesPage = async () => {
  const seriesWithPosts = await Promise.all(
    featuredSeries.map(async (series) => {
      const allPosts = await getAllPosts({ series: series.slug });
      return {
        series,
        postsLength: allPosts.length,
        recentPosts: allPosts.slice(0, 3),
      };
    }),
  );

  return (
    <Client>
      {seriesWithPosts.map(({ series, postsLength, recentPosts }, index) => (
        <SeriesCard
          key={index}
          series={series}
          postsLength={postsLength}
          recentPosts={recentPosts}
        />
      ))}
    </Client>
  );
};

export default SeriesPage;
