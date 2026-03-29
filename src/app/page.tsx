import dynamic from "next/dynamic";
import Hero from "@/components/pages/Hero";
import NewPosts from "@/components/pages/NewPosts";
import FeaturedSeries from "@/components/pages/FeaturedSeries";
import Request from "@/components/pages/Request";
import { getAllPosts } from "@/lib/post-metadata";
import PostsLength from "@/components/pages/PostsLength";
import GalleryLength from "@/components/pages/GalleryLength";
import { getPhotos } from "@/lib/photo";
import Affiliates from "@/components/pages/Affiliates";
import HighIntentSection from "@/components/pages/HighIntentSection";
import { getHighIntentPosts } from "@/lib/revenue";
import InstallPWAButton from "@/components/features/pwa/InstallPWAButton";
import EntryPostsSection from "@/components/pages/EntryPostsSection";
import HomeUtilitySection from "@/components/pages/HomeUtilitySection";
import HomeAboutSection from "@/components/pages/HomeAboutSection";
import { getHomepageEntryPosts } from "@/lib/post-discovery";

const Gallery = dynamic(() => import("@/components/pages/Gallery"));
const Destination = dynamic(() => import("@/components/pages/Destination"));

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const allPhotos = await getPhotos();
  const photoLength = allPhotos.length;
  const highIntentPosts = getHighIntentPosts(allPosts);
  const entryPosts = getHomepageEntryPosts(allPosts);

  return (
    <>
      <Hero />
      <EntryPostsSection posts={entryPosts} />
      <HighIntentSection posts={highIntentPosts} />
      <Destination
        title="目的地から探す"
        description="国や都市から記事をたどりたい人向けに、地域別の入口を用意しています。"
        buttonLabel="地域別の記事を見る"
      />
      <FeaturedSeries />
      <NewPosts posts={allPosts} />
      <Gallery teaser />
      <HomeUtilitySection />
      <HomeAboutSection />
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
