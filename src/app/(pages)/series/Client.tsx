"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/components/common/animation";
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
      <motion.section
        variants={staggerContainer()}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="mb-12 text-center text-muted-foreground space-y-4 max-w-3xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
      </motion.section>
    </div>
  );
};

export default Client;
