import dynamic from "next/dynamic";
import AIPlannerHero from "@/components/pages/AIPlannerHero";
import Hero from "@/components/pages/Hero";
import NewPosts from "@/components/pages/NewPosts";
import FeaturedSeries from "@/components/pages/FeaturedSeries";
import PopularPosts from "@/components/pages/PopularPosts";
import Request from "@/components/pages/Request";
import { getAllPosts } from "@/lib/posts";
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

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const allPhotos = await getPhotos();
  const photoLength = allPhotos.length;
  const highIntentPosts = getHighIntentPosts(allPosts);
  return (
    <>
      <Hero />
      <HighIntentSection posts={highIntentPosts} />
      <NewPosts posts={allPosts} />
      <FeaturedSeries />
      <PopularPosts posts={highIntentPosts.length ? highIntentPosts : allPosts} />
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
