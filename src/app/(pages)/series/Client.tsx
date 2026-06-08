import HeroSection from "@/components/pages/HeroSection";

interface ClientProps {
  children: React.ReactNode;
}

const Client = ({ children }: ClientProps) => {
  return (
    <div>
      {/* ==================== Hero Section ==================== */}
      <HeroSection
        src="/images/Greece/oia-castle-sunset-view.jpg"
        alt="Series Hero Image"
        pageTitle="SERIES"
        pageMessage="テーマで旅を深掘りする"
      />

      {/* ==================== Series List ==================== */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-muted-foreground mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <p>
            「ともきちの旅行日記」では、様々な国や地域での体験をいくつかのテーマに沿って「シリーズ」としてまとめています。
            バックパッカーとしてのアジア周遊から、ヨーロッパの美しい絶景・建築を巡る旅まで、
            多様な視点から切り取った旅行記をお楽しみいただけます。
          </p>
          <p>
            各シリーズのカードから、そのテーマに属する記事一覧や最新の旅行記にアクセスできます。
            あなたの興味を惹くテーマを見つけて、新しい旅の世界へ出かけてみましょう。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">{children}</div>
      </section>
    </div>
  );
};

export default Client;
