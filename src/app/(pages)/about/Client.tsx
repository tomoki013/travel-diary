import AboutJourneySection from "@/components/features/about/AboutJourneySection";
import JourneyTeaser from "@/components/features/about/JourneyTeaser";
import AboutMeSection from "@/components/features/about/AboutMeSection";
import FootprintsSection from "@/components/features/about/FootprintsSection";
import RoadmapPromo from "@/components/features/roadmap/RoadmapPromo";

const Client = () => {
  return (
    <>
      <AboutJourneySection />
      <AboutMeSection />
      <JourneyTeaser />
      <RoadmapPromo />
      {/* 「旅の記録」は最下部に配置する */}
      <FootprintsSection />
    </>
  );
};

export default Client;
