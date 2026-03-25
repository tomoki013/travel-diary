import Image from "next/image";
import Link from "next/link";
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
    <section className="relative flex h-[85vh] flex-col items-center justify-center px-4 pt-40 text-center text-white md:flex-row md:px-0 md:pt-44">
      <Image
        src="/images/Turkey/balloons-in-cappadocia.jpg"
        alt="Man looking at a globe"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="absolute inset-0 bg-black/40 -z-10" />

      <div className="max-w-4xl px-8">
        <h1 className="mb-4 font-heading text-5xl font-bold leading-tight text-shadow-[2px_2px_10px_rgba(0,0,0,0.5)] md:text-7xl">
          次の冒険は、どこへ？
        </h1>
        <p className="text-lg font-medium md:text-xl text-shadow-[1px_1px_5px_rgba(0,0,0,0.5)]">
          世界を旅した記憶と体験、そして次の旅のインスピレーションをお届けします。
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/90 md:text-base text-shadow-[1px_1px_5px_rgba(0,0,0,0.5)]">
          息を呑むような絶景、その土地ならではの文化、そして旅先での小さな発見。
          まだ見ぬ世界への扉を開き、あなただけの物語を見つけにいきませんか。
        </p>

        <div className="font-code my-10 text-4xl text-white/90 text-shadow-[2px_2px_8px_rgba(0,0,0,0.5)]">Tomokichi</div>
        <LoadingAnimation
          variant="splitFlap"
          className="mt-12 flex items-center justify-center"
          words={shuffleArray(allRegions.map((region) => region.slug.toUpperCase()))}
          flapBG=""
        />
      </div>

      <WorldMap highlightedRegions={allCountryNames} isClickable={false} />
    </section>
  );
};

export default Hero;
