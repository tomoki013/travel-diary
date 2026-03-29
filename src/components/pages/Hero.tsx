import Image from "next/image";
import { LoadingAnimation } from "../features/LoadingAnimation/LoadingAnimation";
import { allRegions } from "@/lib/regionUtil";
import WorldMap from "../features/worldMap/WorldMap";
import { regionData } from "@/data/region";
import { shuffleArray } from "@/lib/shuffleArray";

const Hero = () => {
  const allCountryNames = regionData.flatMap((continent) =>
    continent.countries.map((country) => country.slug),
  );

  return (
    <section className="relative flex min-h-[90vh] md:h-[85vh] flex-col items-center justify-center px-4 pt-32 pb-16 text-center text-stone-50 md:flex-row md:px-8 md:pt-40 md:pb-20 overflow-hidden">
      <Image
        src="/images/Turkey/balloons-in-cappadocia.jpg"
        alt="Hot air balloons in Cappadocia"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900/70 -z-10" />

      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center justify-between gap-12 md:flex-row md:gap-8">
        <div className="flex w-full max-w-2xl flex-col items-center md:items-start text-center md:text-left drop-shadow-lg">
          <h1 className="mb-6 font-heading text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
            次の冒険は、<br className="hidden md:block" />どこへ？
          </h1>
          <p className="mb-6 text-lg font-medium tracking-wide text-amber-50/90 md:text-xl lg:text-2xl">
            世界を旅した記憶と体験、<br className="md:hidden" />そして次の旅のインスピレーションを。
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-stone-200 md:text-base">
            息を呑むような絶景、その土地ならではの文化、そして旅先での小さな発見。
            まだ見ぬ世界への扉を開き、あなただけの物語を見つけにいきませんか。
          </p>

          <div className="mt-10 md:mt-16 w-full max-w-sm">
            <p className="mb-4 font-code text-sm tracking-[0.3em] text-amber-200/80 uppercase">Destinations</p>
            <LoadingAnimation
              variant="splitFlap"
              className="flex items-center justify-center md:justify-start"
              words={shuffleArray(allRegions.map((region) => region.slug.toUpperCase()))}
              flapBG="bg-stone-800/80 backdrop-blur-sm border border-stone-600/50"
            />
          </div>
        </div>

        <div className="relative w-full max-w-xl flex-shrink-0 md:w-1/2 drop-shadow-2xl">
          <WorldMap highlightedRegions={allCountryNames} isClickable={false} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
