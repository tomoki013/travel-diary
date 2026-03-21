import dynamic from "next/dynamic";
import AIPlannerHero from "@/components/pages/AIPlannerHero";
import Hero from "@/components/pages/Hero";
import NewPosts from "@/components/pages/NewPosts";
import FeaturedSeries from "@/components/pages/FeaturedSeries";
import PopularPosts from "@/components/pages/PopularPosts";
import Request from "@/components/pages/Request";
import { getAllPosts } from "@/lib/post-metadata";
import PostsLength from "@/components/pages/PostsLength";
import GalleryLength from "@/components/pages/GalleryLength";
import { getPhotos } from "@/lib/photo";
import Affiliates from "@/components/pages/Affiliates";
import HighIntentSection from "@/components/pages/HighIntentSection";
import { getHighIntentPosts } from "@/lib/revenue";
import JourneyTeaser from "@/components/features/about/JourneyTeaser";
import InstallPWAButton from "@/components/features/pwa/InstallPWAButton";

const GlobePromo = dynamic(() => import("@/components/features/promo/GlobePromo"));
const Gallery = dynamic(() => import("@/components/pages/Gallery"));
const Destination = dynamic(() => import("@/components/pages/Destination"));

const pickLatestSeriesPosts = <T extends { category: string }>(posts: T[]) => {
  const seriesPosts = posts.filter((post) => post.category === "series");
  if (seriesPosts.length >= 3) {
    return seriesPosts;
  }

  return posts.filter(
    (post) => post.category === "series" || post.category === "itinerary",
  );
};

const interleavePosts = <T extends { slug: string }>(groups: T[][], limit: number) => {
  const seen = new Set<string>();
  const result: T[] = [];
  let cursor = 0;

  while (result.length < limit) {
    let didAppend = false;

    for (const group of groups) {
      const candidate = group[cursor];
      if (!candidate || seen.has(candidate.slug)) {
        continue;
      }

      seen.add(candidate.slug);
      result.push(candidate);
      didAppend = true;

      if (result.length === limit) {
        break;
      }
    }

    if (!didAppend) {
      break;
    }

    cursor += 1;
  }

  return result;
};

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const allPhotos = await getPhotos();
  const photoLength = allPhotos.length;
  const highIntentPosts = getHighIntentPosts(allPosts);
  const storyPosts = pickLatestSeriesPosts(allPosts);
  const mixedFeaturedPosts = interleavePosts(
    [storyPosts, highIntentPosts, allPosts],
    4,
  );

  return (
    <>
      <Hero />
      <NewPosts
        posts={storyPosts}
        title="Travel Diary & Series"
        description="最新の旅行日記や連載から、実体験ベースの記事を先に読めるようにしました。"
        buttonHref="/series"
        buttonLabel="旅行日記シリーズを見る"
      />
      <HighIntentSection posts={highIntentPosts} />
      <FeaturedSeries />
      <PopularPosts
        posts={mixedFeaturedPosts}
        title="体験とガイドを横断して読む"
        description="このサイトらしさである旅行日記と、実用ガイドを混ぜておすすめしています。"
        limit={4}
      />
      <AIPlannerHero />
      <GlobePromo />
      <Gallery />
      <JourneyTeaser />
      <Destination />
      <Affiliates />
      <Request />
      <PostsLength posts={allPosts} />
      <GalleryLength galleryLength={photoLength} />
      <div className="flex justify-center pb-20 mt-10">
        <InstallPWAButton />
      </div>
    </>
  );
}
