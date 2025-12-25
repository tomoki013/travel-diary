import AIPlannerHero from "@/components/pages/AIPlannerHero";
import Hero from "@/components/pages/Hero";
import NewPosts from "@/components/pages/NewPosts";
import FeaturedSeries from "@/components/pages/FeaturedSeries";
import PopularPosts from "@/components/pages/PopularPosts";
import Gallery from "@/components/pages/Gallery";
import Request from "@/components/pages/Request";
import { getAllPosts } from "@/lib/posts";
import Destination from "@/components/pages/Destination";
import PostsLength from "@/components/pages/PostsLength";
import GalleryLength from "@/components/pages/GalleryLength";
import { getPhotos } from "@/lib/photo";
import Affiliates from "@/components/pages/Affiliates";
import GlobePromo from "@/components/features/promo/GlobePromo";
import InstallPWAButton from "@/components/features/pwa/InstallPWAButton";

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const allPhotos = await getPhotos();
  const photoLength = allPhotos.length;
  return (
    <>
      <Hero />
      <AIPlannerHero />
      <NewPosts posts={allPosts} />
      <GlobePromo />
      <Destination />
      <FeaturedSeries />
      <PopularPosts posts={allPosts} />
      <Gallery />
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
