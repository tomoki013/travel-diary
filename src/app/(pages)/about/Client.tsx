"use client";

import AboutJourneySection from "@/components/features/about/AboutJourneySection";
import JourneyTeaser from "@/components/features/about/JourneyTeaser";
import AboutMeSection from "@/components/features/about/AboutMeSection";
import CommunitySection from "@/components/features/about/CommunitySection";
import RoadmapPromo from "@/components/features/roadmap/RoadmapPromo";

const Client = () => {
  return (
    <>
      <AboutJourneySection />
      <JourneyTeaser />
      <RoadmapPromo />
      <AboutMeSection />
      <CommunitySection />
    </>
  );
};

export default Client;
