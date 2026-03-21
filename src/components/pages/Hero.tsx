import Image from "next/image";
import Link from "next/link";
import { Compass, NotebookPen } from "lucide-react";
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
    <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden pt-30 text-white">
      <Image
        src="/images/Turkey/balloons-in-cappadocia.jpg"
        alt="カッパドキアの気球と空を眺める風景"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 md:flex-row md:items-end md:px-10">
        <div className="max-w-3xl text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
            Travel Journal & Practical Guides
          </div>
          <h1 className="mt-6 font-heading text-5xl font-bold leading-tight text-shadow-[2px_2px_12px_rgba(0,0,0,0.45)] md:text-7xl">
            観光情報も、
            <br />
            旅のぬくもりも。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/90 md:text-lg">
            次の旅に役立つ観光情報を探しながら、同時に旅先で感じた温度や記憶までたどれる場所。
            ともきちが歩いて集めた実用情報と旅行日記を、ひとつのトップページにまとめています。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/posts?category=tourism"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:scale-[1.02]"
            >
              <Compass className="h-4 w-4" />
              観光情報から探す
            </Link>
            <Link
              href="/journey"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <NotebookPen className="h-4 w-4" />
              旅行日記を読む
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/85">
            <span className="rounded-full border border-white/15 bg-black/15 px-4 py-2 backdrop-blur-sm">
              実用ラベルは観光情報だけに限定
            </span>
            <span className="rounded-full border border-white/15 bg-black/15 px-4 py-2 backdrop-blur-sm">
              旅の記録やシリーズも同じ熱量で発信
            </span>
          </div>
        </div>

        <div className="w-full max-w-xl rounded-[2rem] border border-white/15 bg-black/25 p-6 backdrop-blur-md md:ml-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Visited Regions
          </p>
          <div className="mt-4 font-code text-3xl text-white/95 md:text-4xl">Tomokichi</div>
          <p className="mt-3 text-sm leading-7 text-white/80">
            旅先で役立ったことは観光情報として整理し、心に残った景色や出来事は日記として残しています。
            準備にも余韻にも寄り添える旅サイトを目指しています。
          </p>
          <LoadingAnimation
            variant="splitFlap"
            className="mt-8 flex items-center"
            words={shuffleArray(allRegions.map((region) => region.slug.toUpperCase()))}
            flapBG=""
          />
        </div>
      </div>

      <WorldMap highlightedRegions={allCountryNames} isClickable={false} />
    </section>
  );
};

export default Hero;
