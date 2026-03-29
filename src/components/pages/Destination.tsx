"use client";

import { useRef } from "react";
import { sectionVariants } from "../common/animation";
import WorldMap, { WorldMapHandle } from "../features/worldMap/WorldMap";
import { motion } from "framer-motion";
import { regionData } from "@/data/region";
import Button from "../common/Button";

// Icon Components
const ZoomInIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className || "h-6 w-6"}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ZoomOutIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className || "h-6 w-6"}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ResetIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className || "h-6 w-6"}
  >
    <path d="M3 2v6h6" />
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M21 22v-6h-6" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
  </svg>
);

interface DestinationProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
}

const Destination = ({
  title = "世界地図から、旅先を探す",
  description = "気になる国や都市から、現地で読める記事を探せます。",
  buttonLabel = "地域別一覧を見る",
}: DestinationProps) => {
  const worldMapRef = useRef<WorldMapHandle>(null);
  // すべての国名を小文字の配列として抽出
  const allCountryNames = regionData.flatMap((continent) =>
    continent.countries.map((country) => country.slug)
  );

  const handleResetZoom = () => {
    worldMapRef.current?.resetZoom();
  };

  const handleZoomIn = () => {
    worldMapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    worldMapRef.current?.zoomOut();
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      className="py-24 px-6 md:px-8 max-w-5xl mx-auto"
    >
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="w-30 h-0.5 bg-secondary mx-auto mt-6" />
      </div>
      <div className="relative">
        <WorldMap
          ref={worldMapRef}
          highlightedRegions={allCountryNames}
          isClickable={true}
          isTooltip={true}
          regionData={regionData}
          isZoomable={true}
        />
        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="ズームイン"
          >
            <ZoomInIcon />
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="ズームアウト"
          >
            <ZoomOutIcon />
          </button>
          <button
            onClick={handleResetZoom}
            className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="ズームをリセット"
          >
            <ResetIcon />
          </button>
        </div>
      </div>
      <Button href={`/destination`}>{buttonLabel}</Button>
    </motion.section>
  );
};

export default Destination;
