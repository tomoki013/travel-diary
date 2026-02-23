import { getRegionBySlug, getAllRegionSlugs } from "@/lib/regionUtil";
import Client from "./Client";
import { notFound } from "next/navigation";
import { regionData } from "@/data/region";
import { getAllPosts } from "@/lib/posts";

export const dynamicParams = false;

// 1. 静的パスを生成
export async function generateStaticParams() {
  const slugs = getAllRegionSlugs();
  return slugs.map((slug) => ({
    region: slug,
  }));
}

// 2. Pageコンポーネント
const DestinationPage = async (props: {
  params: Promise<{ region: string }>;
}) => {
  const params = await props.params;
  const regionSlug = params.region;
  const currentRegion = getRegionBySlug(regionSlug);

  // 地域が見つからなければ404
  if (!currentRegion) {
    return notFound();
  }

  // 3. 関連する記事を取得
  const country = regionData
    .flatMap((continent) => continent.countries)
    .find((c) => c.slug === regionSlug);

  const targetSlugs = [regionSlug];
  if (country && country.children) {
    targetSlugs.push(...country.children.map((child) => child.slug));
  }

  const seriesPosts = await getAllPosts({
    category: "series",
    region: targetSlugs,
    limit: 4,
  });
  const tourismPosts = await getAllPosts({
    category: "tourism",
    region: targetSlugs,
    limit: 3,
  });
  const itineraryPosts = await getAllPosts({
    category: "itinerary",
    region: targetSlugs,
    limit: 3,
  });
  const oneOffPosts = await getAllPosts({
    category: "one-off",
    region: targetSlugs,
    limit: 3,
  });

  return (
    <Client
      region={currentRegion}
      seriesPosts={seriesPosts}
      tourismPosts={tourismPosts}
      itineraryPosts={itineraryPosts}
      oneOffPosts={oneOffPosts}
      regionData={regionData}
    />
  );
};

export default DestinationPage;
