"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { SplitFlapBoard } from "../features/LoadingAnimation/SplitFlapBoard";
import WorldMapPlaceholder from "../features/worldMap/WorldMapPlaceholder";
import { allRegions } from "@/lib/regionUtil";

const WorldMap = dynamic(() => import("../features/worldMap/WorldMap"), {
  ssr: false,
  // ファーストビュー内で動き続けるローディングは Speed Index を悪化させる
  // ため、最終形に近い静的シルエットを表示する(WorldMapPlaceholder 参照)。
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <WorldMapPlaceholder />
    </div>
  ),
});
import { regionData } from "@/data/region";
import { shuffleArray } from "@/lib/shuffleArray";

const Hero = () => {
  const allCountryNames = regionData.flatMap((continent) =>
    continent.countries.map((country) => country.slug),
  );

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 pt-32 pb-16 text-center text-stone-50 md:h-[85vh] md:flex-row md:px-8 md:pt-40 md:pb-20">
      <Image
        src="/images/Turkey/balloons-in-cappadocia.jpg"
        alt="Hot air balloons in Cappadocia"
        fill
        className="-z-10 object-cover"
        priority
        fetchPriority="high"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900/70" />

      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center justify-between gap-12 md:flex-row md:gap-8">
        <div className="flex w-full max-w-2xl flex-col items-center text-center drop-shadow-lg md:items-start md:text-left">
          <h1 className="font-heading mb-6 text-5xl leading-tight font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
            次の冒険は、
            <br className="hidden md:block" />
            どこへ？
          </h1>
          <p className="mb-6 text-lg font-medium tracking-wide text-amber-50/90 md:text-xl lg:text-2xl">
            世界を旅した記憶と体験、
            <br className="md:hidden" />
            そして次の旅のインスピレーションを。
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-stone-200 md:text-base">
            息を呑むような絶景、その土地ならではの文化、そして旅先での小さな発見。
            まだ見ぬ世界への扉を開き、あなただけの物語を見つけにいきませんか。
          </p>

          <div className="mt-10 w-full max-w-sm md:mt-16">
            <p className="font-code mb-4 text-sm tracking-[0.3em] text-amber-200/80 uppercase">
              Destinations
            </p>
            <SplitFlapBoard
              className="font-code flex items-center justify-center text-sm tracking-[0.3em] text-amber-400 uppercase md:justify-start"
              words={shuffleArray(allRegions.map((region) => region.slug.toUpperCase()))}
              flapBG="bg-transparent"
            />
          </div>
        </div>

        <div className="relative aspect-[8/5] w-full max-w-xl flex-shrink-0 drop-shadow-2xl md:w-1/2">
          <WorldMap highlightedRegions={allCountryNames} isClickable={false} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
