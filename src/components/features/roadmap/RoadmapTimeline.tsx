"use client";

import { motion } from "framer-motion";
import { Rocket, Globe, MapPin, Languages, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect, useCallback } from "react";

// --- Mock Data ---
interface RoadmapItem {
  id: string;
  season: string;
  title: string;
  description: string;
  status: "COMPLETED" | "DEPLOYED" | "CURRENT_TARGET" | "PENDING" | "CONCEPT";
  icon: React.ReactNode;
}

const ROADMAP_DATA: RoadmapItem[] = [
  {
    id: "genesis",
    season: "2024.Q4",
    title: "旅の始まり",
    description:
      "旅行ブログ「ともきちの旅行日記」がスタートしました。Next.jsとMicroCMSで構築された、デジタルな旅の拠点が完成。",
    status: "COMPLETED",
    icon: <Rocket className="w-6 h-6" />,
  },
  {
    id: "ai-nav",
    season: "2025.Q1",
    title: "AIナビゲーター",
    description:
      "AIがあなたの旅をサポート。過去の冒険（記事）を参照して、最適なプランを提案する機能を追加しました。",
    status: "DEPLOYED",
    icon: <MapPin className="w-6 h-6" />,
  },
  {
    id: "globe",
    season: "2025.Q2",
    title: "地球儀ダイアリー",
    description:
      "旅の思い出を3D地球儀上で振り返る。訪れた場所が光り輝く、新しいアルバム体験。",
    status: "CURRENT_TARGET",
    icon: <Globe className="w-6 h-6" />,
  },
  {
    id: "global",
    season: "2025.Q3",
    title: "世界への扉",
    description:
      "言葉の壁を超えて。英語・中国語に対応し、より多くの旅人とつながるプラットフォームへ。",
    status: "PENDING",
    icon: <Languages className="w-6 h-6" />,
  },
  {
    id: "neural",
    season: "2025.Q4",
    title: "ポケットの中の旅",
    description:
      "専用モバイルアプリの構想。オフラインでも旅の記録にアクセスできるように。",
    status: "CONCEPT",
    icon: <Smartphone className="w-6 h-6" />,
  },
];

const StatusBadge = ({ status }: { status: RoadmapItem["status"] }) => {
  const styles = {
    COMPLETED: "bg-primary/10 text-primary border-primary/20",
    DEPLOYED: "bg-secondary/10 text-secondary border-secondary/20",
    CURRENT_TARGET:
      "bg-primary/10 text-primary border-primary/20 animate-pulse ring-1 ring-primary/30",
    PENDING: "bg-muted text-muted-foreground border-border",
    CONCEPT: "bg-muted text-muted-foreground border-border dashed border-2",
  };

  const labels = {
    COMPLETED: "Check-in Complete",
    DEPLOYED: "In Flight",
    CURRENT_TARGET: "Boarding Now",
    PENDING: "Scheduled",
    CONCEPT: "Planning",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 text-xs font-semibold rounded-full border shadow-sm",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
};

export default function RoadmapTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [startPath, setStartPath] = useState("");
  const [mainPath, setMainPath] = useState("");
  const [tailPath, setTailPath] = useState("");
  const [svgHeight, setSvgHeight] = useState(0);

  const updatePositions = useCallback(() => {
    if (!timelineRef.current || dotRefs.current.length === 0) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const dots = dotRefs.current
      .filter((el): el is HTMLDivElement => el !== null)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          // Calculate center relative to timeline container
          x: rect.left + rect.width / 2 - timelineRect.left,
          y: rect.top + rect.height / 2 - timelineRect.top,
          // Store radius for calculation (width / 2)
          itemRadius: rect.width / 2,
        };
      });

    if (dots.length === 0) return;

    // Calculate center x of the timeline
    const centerX = timelineRect.width / 2;
    const firstDot = dots[0];
    const lastDot = dots[dots.length - 1];

    // Dot radius adjustment (assuming somewhat circular, taking from width)
    // The dot container has p-1.5 (6px) + w-3 (12px) = 24px width approx. Radius ~12px.
    const dotRadius = firstDot.itemRadius;

    // --- Start Path (Top -> First Dot Top) ---
    // Start fading in from top
    let sPath = `M ${centerX} 0`;
    // End at the TOP of the first dot (y - radius)
    const startDistY = firstDot.y - dotRadius;

    // Curve to the first dot top
    // Control point logic: maintain smooth entry
    // p1: (centerX, 0)
    // p2: (firstDot.x, startDistY)

    // If we want a smooth S-curve, we typically use 2 control points.
    // CP1: Vertical from start
    // CP2: Vertical from end (into the dot)

    // Halfway vertical
    const startMidY = startDistY * 0.5;

    sPath += ` C ${centerX} ${startMidY}, ${firstDot.x} ${startMidY}, ${firstDot.x} ${startDistY}`;
    setStartPath(sPath);

    // --- Main Path (First Dot Center -> Last Dot Center) ---
    // Actually, to be continuous, main path should technically start/end at edges if we want "gaps" for the dots.
    // However, usually we draw the line BEHIND the dots (or z-index handled).
    // The instructions were specific about the dotted lines (start/tail).
    // For main path, let's keep it center-to-center as it's solid/dashed and goes through nodes.
    // BUT if the user wants "gaps" on the dotted start/end, maybe they want the main path to also be respectful?
    // "Matches first point start" and "Matches last point" usually implies alignment.
    // Let's stick thereto center for main path unless requested otherwise.

    let mPath = `M ${firstDot.x} ${firstDot.y}`;
    for (let i = 0; i < dots.length - 1; i++) {
      const p1 = dots[i];
      const p2 = dots[i + 1];

      const distY = p2.y - p1.y;

      const cp1 = { x: p1.x, y: p1.y + distY * 0.5 };
      const cp2 = { x: p2.x, y: p2.y - distY * 0.5 };

      mPath += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`;
    }
    setMainPath(mPath);

    // --- Tail Path (Last Dot Bottom -> End) ---
    const endY = timelineRect.height;
    // Start from BOTTOM of last dot
    const tailStartY = lastDot.y + dotRadius;
    const endDistY = endY - tailStartY;

    // Smooth curve back to the X position of the FIRST dot (central axis usually)
    // Actually previous code curved back to `firstDot.x`.
    // If `isLast` is centered, `lastDot.x` IS `centerX`.
    // If not, it curves back.

    // Let's target alignment with the start x (usually center or first dot x).
    // The previous code used `firstDot.x` as the return target X.

    let tPath = `M ${lastDot.x} ${tailStartY}`;
    // Curve down
    tPath += ` C ${lastDot.x} ${tailStartY + endDistY * 0.5}, ${firstDot.x} ${tailStartY + endDistY * 0.5}, ${firstDot.x} ${endY}`;

    setTailPath(tPath);
    setSvgHeight(timelineRect.height);
  }, []);

  useEffect(() => {
    // Initial update
    updatePositions();

    const handleResize = () => {
      // Small timeout to allow layout to settle
      setTimeout(updatePositions, 100);
    };

    window.addEventListener("resize", handleResize);

    // Also use ResizeObserver for more robust tracking of content changes
    const observer = new ResizeObserver(() => {
      handleResize();
    });

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [updatePositions]);

  return (
    <section
      ref={timelineRef}
      className="relative max-w-3xl mx-auto px-4 pb-48"
    >
      {/* SVG Path Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <svg
          className="w-full"
          style={{ height: svgHeight }}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Fade IN Gradient (Top to Bottom: Transparent -> Opaque) */}
            <linearGradient id="fadeInGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
            </linearGradient>

            {/* Fade OUT Gradient (Top to Bottom: Opaque -> Transparent) */}
            <linearGradient id="fadeOutGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Start Path: Dotted, Fading IN */}
          <path
            d={startPath}
            stroke="url(#fadeInGradient)"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="text-muted-foreground"
            fill="none"
          />

          {/* Main Path: Solid, Very Light Opacity */}
          <path
            d={mainPath}
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="text-border opacity-5"
            fill="none"
          />

          {/* Tail Path: Dotted, Fading OUT */}
          <path
            d={tailPath}
            stroke="url(#fadeOutGradient)"
            strokeWidth="2"
            strokeDasharray="12 12"
            className="text-muted-foreground"
            fill="none"
          />

          {/* Animated Progress Path (Only main part) */}
          <motion.path
            d={mainPath}
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Timeline Items */}
      <div className="relative z-10 space-y-24 pt-20">
        {ROADMAP_DATA.map((item, index) => {
          const isLast = index === ROADMAP_DATA.length - 1;
          const isEven = index % 2 === 0;
          // Determine alignment based on index to match desired layout
          // 0, 2: Left Peak (25%) -> Content on Right
          // 1, 3: Right Peak (75%) -> Content on Left
          // 4: Back to Center (50%) -> Content on Left/Right (Alternating)

          const dotPosition = isLast
            ? "left-1/2" // Center for last item
            : isEven
              ? "left-[15%] md:left-[25%]" // Left side
              : "left-[85%] md:left-[75%]"; // Right side

          // If dot is Left, Content is Right (flex-row-reverse)
          // If dot is Right, Content is Left (flex-row)
          const rowClass = isEven ? "flex-row-reverse" : "flex-row";

          return (
            <motion.div
              key={item.id}
              className={cn(
                "relative flex gap-4 md:gap-8 items-center",
                rowClass
              )}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Central Node (Dot) */}
              <div
                ref={(el) => {
                  dotRefs.current[index] = el;
                }}
                className={cn(
                  "absolute transform -translate-x-1/2 z-10 bg-background p-1.5 rounded-full border-2 border-primary/20 shadow-sm transition-all duration-500",
                  dotPosition
                )}
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    item.status === "COMPLETED"
                      ? "bg-primary"
                      : item.status === "DEPLOYED"
                        ? "bg-secondary"
                        : item.status === "CURRENT_TARGET"
                          ? "bg-primary animate-pulse"
                          : "bg-muted-foreground/30"
                  )}
                />
              </div>

              {/* Content Card */}
              <div
                className={cn(
                  "w-full md:w-1/2",
                  // Adjust padding to clear the dot area
                  isEven
                    ? "pl-12 md:pl-24 text-left"
                    : "pr-12 md:pr-24 text-right"
                )}
              >
                <div
                  className={cn(
                    "group relative bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-all duration-300",
                    "dark:bg-card/50"
                  )}
                >
                  {/* Season Label */}
                  <div
                    className={cn(
                      "absolute -top-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-sm",
                      isEven ? "left-6" : "right-6"
                    )}
                  >
                    {item.season}
                  </div>

                  <div
                    className={cn(
                      "flex flex-col gap-3",
                      isEven ? "items-start" : "items-end"
                    )}
                  >
                    <div className="mb-1">
                      <StatusBadge status={item.status} />
                    </div>

                    <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                      {item.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>

                    {/* Icon Decoration */}
                    <div
                      className={cn(
                        "absolute opacity-5 text-primary transform scale-150 pointer-events-none",
                        isEven ? "bottom-4 right-4" : "bottom-4 left-4"
                      )}
                    >
                      {item.icon}
                    </div>
                  </div>
                </div>
              </div>

              {/* Balancer */}
              <div className="hidden md:block w-1/2" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
