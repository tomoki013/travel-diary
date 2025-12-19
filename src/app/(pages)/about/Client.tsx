"use client";

import AboutJourneySection from "@/components/features/about/AboutJourneySection";
import AboutMeSection from "@/components/features/about/AboutMeSection";
import CommunitySection from "@/components/features/about/CommunitySection";
import RoadmapPromo from "@/components/features/roadmap/RoadmapPromo";

const Client = () => {
  return (
    <>
      <AboutJourneySection />
      <RoadmapPromo />
      <AboutMeSection />
      <CommunitySection />
    </>
  );
};

export default Client;
