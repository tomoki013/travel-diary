"use client";

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useRouter } from "next/navigation";
import { select, pointer } from "d3-selection";
import { zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import { geoMercator, geoPath } from "d3-geo";
import { json } from "d3-fetch";
import "d3-transition";
import * as topojson from "topojson-client";
import { Topology, GeometryCollection } from "topojson-specification";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import WorldMapPlaceholder from "./WorldMapPlaceholder";
import { ContinentData } from "@/types/types";

interface WorldTopology extends Topology {
  objects: {
    countries: GeometryCollection;
  };
}

// propsの型定義
interface WorldMapProps {
  highlightedRegions: string[];
  isClickable: boolean;
  isTooltip?: boolean;
  regionData?: ContinentData[];
  isZoomable?: boolean;
}

export interface WorldMapHandle {
  resetZoom: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

const WorldMap = forwardRef<WorldMapHandle, WorldMapProps>(
  (
    { highlightedRegions, isClickable, isTooltip = false, regionData = [], isZoomable = false },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showZoomHint, setShowZoomHint] = useState(false);
    const [currentZoom, setCurrentZoom] = useState(1);
    const router = useRouter();
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isMounted, setIsMounted] = useState(false); // ★変更点: マウント状態の管理

    // ★変更点: マウント時に一度だけ実行し、デバイスタイプを判定
    useEffect(() => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
      setIsMounted(true);
    }, []);

    useImperativeHandle(ref, () => ({
      resetZoom: () => {
        if (svgRef.current && zoomRef.current) {
          const svg = select(svgRef.current);
          svg.transition().duration(750).call(zoomRef.current.transform, zoomIdentity);
        }
      },
      zoomIn: () => {
        if (svgRef.current && zoomRef.current) {
          const svg = select(svgRef.current);
          zoomRef.current.scaleBy(svg.transition().duration(750), 1.5);
        }
      },
      zoomOut: () => {
        if (svgRef.current && zoomRef.current) {
          const svg = select(svgRef.current);
          zoomRef.current.scaleBy(svg.transition().duration(750), 0.5);
        }
      },
    }));

    useEffect(() => {
      if (!isZoomable || isLoading) return;

      const currentRef = containerRef.current;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShowZoomHint(true);
            const timer = setTimeout(() => {
              setShowZoomHint(false);
            }, 3000);

            if (currentRef) {
              observer.unobserve(currentRef);
            }
            return () => clearTimeout(timer);
          }
        },
        { threshold: 0.1 },
      );

      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, [isZoomable, isLoading]);

    useEffect(() => {
      // ★変更点: マウントが完了するまで描画処理を待つ
      if (!isMounted) {
        return;
      }

      const drawMap = async () => {
        if (!svgRef.current) {
          return;
        }
        const width = 960;
        const height = 600;

        const svg = select(svgRef.current)
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("class", "w-full h-auto mx-auto");

        svg.selectAll("*").remove();
        const g = svg.append("g");

        const projection = geoMercator()
          .rotate([-163, 0])
          .scale(150)
          .translate([width / 2, height / 1.5]);

        const pathGenerator = geoPath().projection(projection);

        const tooltip = select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("pointer-events", "none");

        try {
          const world = (await json("/data/world-110m.json")) as WorldTopology;
          const countries = topojson.feature(
            world,
            world.objects.countries,
          ) as unknown as FeatureCollection<Geometry, GeoJsonProperties>;

          const paths = g
            .selectAll("path")
            .data(countries.features)
            .join("path")
            .attr("d", pathGenerator)
            .attr("class", (d) => {
              const countryName = d.properties?.name.toLowerCase();
              const isHighlighted = highlightedRegions.includes(countryName);

              let classes = "stroke-secondary transition-colors duration-200 ";
              if (isHighlighted) {
                classes += "fill-primary stroke-primary-foreground";
                if (isClickable) {
                  classes += " cursor-pointer hover:fill-secondary";
                }
              } else {
                classes += "fill-muted";
              }
              return classes;
            });

          // イベント設定は前回同様、デバイスタイプで分岐
          if (isTouchDevice) {
            paths.each(function (d) {
              const path = select(this);
              let touchTimer: NodeJS.Timeout;
              let isLongPress = false;

              path.on("touchstart", (event) => {
                isLongPress = false;
                touchTimer = setTimeout(() => {
                  isLongPress = true;
                  event.preventDefault();
                  if (!isTooltip) return;
                  const countryName = d.properties?.name.toLowerCase();
                  const isHighlighted = highlightedRegions.includes(countryName);

                  if (isHighlighted) {
                    const allCountries = regionData.flatMap((continent) => continent.countries);
                    const countryData = allCountries.find((c) => c.slug === countryName);

                    if (countryData) {
                      const [x, y] = pointer(event, document.body);
                      tooltip.transition().duration(200).style("opacity", 0.9);
                      tooltip
                        .html(
                          `<strong>${countryData.name}</strong><br/><img src="${countryData.imageURL}" alt="${countryData.name}" class="tooltip-image"/>`,
                        )
                        .style("left", x + 15 + "px")
                        .style("top", y - 28 + "px");
                    }
                  }
                }, 500);
              });

              path.on("touchend", () => {
                clearTimeout(touchTimer);
                if (!isLongPress) {
                  tooltip.transition().duration(200).style("opacity", 0);
                  if (!isClickable) return;
                  const countryName = d.properties?.name.toLowerCase();
                  const isHighlighted = highlightedRegions.includes(countryName);
                  if (isHighlighted) {
                    router.push(`/destination/${countryName}`);
                  }
                }
              });

              path.on("touchmove", () => {
                clearTimeout(touchTimer);
                tooltip.transition().duration(200).style("opacity", 0);
              });
            });
          } else {
            paths
              .on("click", (event, d) => {
                if (!isClickable) return;
                const countryName = d.properties?.name.toLowerCase();
                const isHighlighted = highlightedRegions.includes(countryName);
                if (isHighlighted) {
                  router.push(`/destination/${countryName}`);
                }
              })
              .on("mouseover", (event, d) => {
                if (!isTooltip) return;
                const countryName = d.properties?.name.toLowerCase();
                const isHighlighted = highlightedRegions.includes(countryName);

                if (isHighlighted) {
                  const allCountries = regionData.flatMap((continent) => continent.countries);
                  const countryData = allCountries.find((c) => c.slug === countryName);

                  if (countryData) {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip
                      .html(
                        `<strong>${countryData.name}</strong><br/><img src="${countryData.imageURL}" alt="${countryData.name}" class="tooltip-image"/>`,
                      )
                      .style("left", event.pageX + 15 + "px")
                      .style("top", event.pageY - 28 + "px");
                  }
                }
              })
              .on("mousemove", (event) => {
                if (!isTooltip) return;
                tooltip
                  .style("left", event.pageX + 15 + "px")
                  .style("top", event.pageY - 28 + "px");
              })
              .on("mouseout", () => {
                if (!isTooltip) return;
                tooltip.transition().duration(500).style("opacity", 0);
              });
          }

          // このブロックは分岐の外にあるので、必ず実行される
          if (isZoomable) {
            const zoomBehavior = zoom<SVGSVGElement, unknown>()
              .scaleExtent([1, 8])
              .on("zoom", (event) => {
                g.attr("transform", event.transform.toString());
                setCurrentZoom(event.transform.k);
              });
            zoomRef.current = zoomBehavior;
            svg.call(zoomRef.current);
          }

          setIsLoading(false);
        } catch (error) {
          console.error("Error loading or drawing the map:", error);
          setIsLoading(false);
        }
      };

      drawMap();

      return () => {
        select(".tooltip").remove();
      };
    }, [
      isMounted, // ★変更点: isMountedを依存配列に追加
      isTouchDevice,
      highlightedRegions,
      isClickable,
      isTooltip,
      isZoomable,
      regionData,
      router,
    ]);

    return (
      <div ref={containerRef} className="relative mx-auto h-auto w-full">
        {/* 動き続けるローディングは Speed Index を悪化させるため静的シルエットを表示 */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out ${isLoading ? "opacity-100" : "pointer-events-none opacity-0"} `}
        >
          <WorldMapPlaceholder />
        </div>
        <svg
          ref={svgRef}
          style={{ touchAction: "none" }}
          className={`h-full w-full transition-opacity duration-500 ease-in-out ${isLoading ? "opacity-0" : "opacity-100"} `}
        />
        {isZoomable && (
          <div
            className={`bg-background/80 text-foreground absolute top-4 left-1/2 -translate-x-1/2 rounded-md px-4 py-2 shadow-lg transition-opacity duration-500 ease-in-out ${showZoomHint ? "opacity-100" : "pointer-events-none opacity-0"} `}
          >
            <p className="text-sm">スクロールやピンチで拡大できます</p>
          </div>
        )}
        {isZoomable && !isLoading && (
          <div className="bg-background/80 text-foreground pointer-events-none absolute bottom-4 left-4 rounded-md px-3 py-1 shadow-lg">
            <p className="text-sm font-semibold">×{currentZoom.toFixed(1)}/×8.0</p>
          </div>
        )}
      </div>
    );
  },
);

WorldMap.displayName = "WorldMap";
export default WorldMap;
