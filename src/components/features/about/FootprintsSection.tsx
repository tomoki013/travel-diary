import { Reveal } from "@/components/common/Reveal";
import WorldMap from "../worldMap/WorldMap";
import { regionData } from "@/data/region";

/**
 * 訪問国を世界地図で可視化する「旅の記録」セクション。
 * About ページの最下部に配置する。
 */
const FootprintsSection = () => {
  // 訪問した国名を slug の配列として抽出
  const visitedCountryNames = regionData.flatMap((continent) =>
    continent.countries.map((country) => country.slug),
  );

  const visitedCountriesCount = visitedCountryNames.length;
  const totalCountries = 196;

  return (
    <Reveal as="section" className="py-20 md:py-28">
      <div className="text-foreground mx-auto max-w-5xl px-6">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
          旅の記録 - My Footprints
        </h2>
        <WorldMap highlightedRegions={visitedCountryNames} isClickable={true} />
        <div className="mt-8 text-center">
          <p className="text-xl font-bold md:text-2xl">
            <span className="text-primary text-3xl font-extrabold md:text-4xl">
              {visitedCountriesCount}
            </span>
            <span className="mx-2 text-lg md:text-xl">/</span>
            <span className="text-lg md:text-xl">{totalCountries}</span>
          </p>
        </div>
      </div>
    </Reveal>
  );
};

export default FootprintsSection;
