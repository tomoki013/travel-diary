"use client";

import AllDestination from "@/components/features/destination/allDestination";
import WorldMap from "@/components/features/worldMap/WorldMap";
import Destination from "@/components/pages/Destination";
import { AllDestinationProps } from "@/types/types";
import Image from "next/image";

const Client = ({ regionData }: AllDestinationProps) => {
  // すべての国名を小文字の配列として抽出
  const allCountryNames = regionData.flatMap((continent) =>
    continent.countries.map((country) => country.slug),
  );
  return (
    <div>
      <section className="relative flex h-[85vh] flex-col items-center justify-center text-center text-white md:flex-row">
        <Image
          src={`/images/Turkey/balloons-in-cappadocia.jpg`}
          alt="Man looking at a globe"
          fill
          className="-z-10 object-cover"
          priority
        />
        <div className="absolute inset-0 -z-10 bg-black/35" />
        <div className="max-w-4xl px-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">DESTINATIONS</h1>
          <p className="text-md mt-4 max-w-2xl md:text-lg">世界地図から、旅先を探す</p>
        </div>
        <div className="mx-auto h-auto w-full">
          <WorldMap highlightedRegions={allCountryNames} isClickable={false} />
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        <section className="text-muted-foreground mx-auto -mb-10 max-w-3xl space-y-4 text-center">
          <p>
            当ブログでこれまでに訪れた国や地域別の旅行記・実用情報の一覧です。アジア、ヨーロッパ、中東など、実際に現地へ足を運んで得た体験談や、ビザ・交通機関などのアクセス情報を地域ごとにまとめています。
          </p>
          <p>
            旅行の計画を立てる際や、特定の都市に関する具体的な情報をお探しの場合は、以下の地図または地域リストから目的の国を選択して記事をご覧ください。現地でのリアルな空気感や役立つ知識をお届けします。
          </p>
        </section>

        {/* ==================== インタラクティブな世界地図 ==================== */}
        <Destination />

        {/* ==================== 地域別リスト ==================== */}
        <AllDestination
          regionData={regionData}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"
          countryStyle="border-b-2 border-secondary"
        />
      </div>
    </div>
  );
};

export default Client;
