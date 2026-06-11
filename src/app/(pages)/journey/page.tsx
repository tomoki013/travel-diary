import JourneyHero from "@/components/features/journey/JourneyHero";
import JourneyTimeline from "@/components/features/journey/JourneyTimeline";
import { createPageMetadata } from "@/lib/page-metadata";

// NOTE: 以前指定していた /images/og/journey.jpg は実在しないファイルだった
// ため削除し、ルートレイアウトのデフォルトOGP画像を継承する。
export const metadata = createPageMetadata({
  title: "Journey - 旅の軌跡",
  description:
    "ともきちのこれまでの旅の記録。訪れた国々、出会った風景、心に残る瞬間をタイムライン形式で振り返ります。",
  socialDescription:
    "旅の記憶、足跡の記録。訪れた場所、出会った風景、そして心に残った瞬間のアーカイブ。",
  path: "/journey",
});

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
