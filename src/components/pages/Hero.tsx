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
        <p className="text-lg font-medium md:text-xl">
          世界を旅した記憶と体験を、あなたと共有したい
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/90 md:text-base">
          役立つ観光情報を探したい時も、旅先で感じた空気ごと日記としてたどりたい時も、
          この場所から自然に行き来できるトップページを目指しています。
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link
            href="/posts?category=tourism"
            className="rounded-full bg-white px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-white/90"
          >
            観光情報を見る
          </Link>
          <Link
            href="/journey"
            className="rounded-full border border-white/35 bg-white/10 px-5 py-2.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
          >
            旅行日記を見る
          </Link>
        </div>

        <div className="font-code my-4 text-4xl text-white/90">Tomokichi</div>
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
