import { featuredSeries } from "@/data/series";
import { getAllPosts } from "@/lib/posts";
import Client from "./Client";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return featuredSeries.map((series) => ({
    slug: series.slug,
  }));
}

const eachSeries = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const slug = await params.slug;

  const series = featuredSeries.find((s) => s.slug === slug);
  if (!series) return notFound();

  const allSeriesPosts = await getAllPosts({ category: "series" });
  const allPosts = allSeriesPosts.filter((post) => post.series === slug);

  return <Client allPosts={allPosts} series={series} />;
};

export default eachSeries;
