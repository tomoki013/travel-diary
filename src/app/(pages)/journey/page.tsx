import { Metadata } from "next";
import JourneyHero from "@/components/features/journey/JourneyHero";
import JourneyTimeline from "@/components/features/journey/JourneyTimeline";

export const metadata: Metadata = {
  title: "Journey - 旅の軌跡",
  description:
    "ともきちのこれまでの旅の記録。訪れた国々、出会った風景、心に残る瞬間をタイムライン形式で振り返ります。",
  openGraph: {
    title: "Journey - 旅の軌跡 | ともきちの旅行日記",
    description:
      "旅の記憶、足跡の記録。訪れた場所、出会った風景、そして心に残った瞬間のアーカイブ。",
    images: [
      {
        url: "/images/og/journey.jpg", // Placeholder or generic OG image
        width: 1200,
        height: 630,
        alt: "Journey History",
      },
    ],
  },
};

export default function JourneyPage() {
  return (
    <main className="bg-background min-h-screen">
      <JourneyHero />
      <div className="container mx-auto">
        <JourneyTimeline />
      </div>
    </main>
  );
}
