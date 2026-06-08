import { featuredSeries } from "@/data/series";
import SeriesCard from "../common/SeriesCard";
import Button from "../common/Button";
import { Reveal, RevealStagger } from "@/components/common/Reveal";

const FeaturedSeries = () => {
  return (
    <Reveal as="section" className="mx-auto max-w-6xl px-6 py-24 md:px-8">
      {/* セクションタイトル */}
      <div className="mb-16 text-center">
        <h2 className="font-heading text-foreground text-4xl font-bold md:text-5xl">
          Featured Series
        </h2>
        <div className="bg-secondary mx-auto mt-6 h-0.5 w-30"></div>
      </div>

      {/* カードグリッド */}
      <RevealStagger className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {featuredSeries.slice(0, 6).map((series) => (
          <Reveal key={series.id}>
            <SeriesCard series={series} />
          </Reveal>
        ))}
      </RevealStagger>

      {/* ボタン */}
      <Button href={`/series`}>シリーズ一覧を見る</Button>
    </Reveal>
  );
};

export default FeaturedSeries;
