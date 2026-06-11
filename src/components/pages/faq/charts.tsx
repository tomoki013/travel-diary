"use client";

import { useState, useRef } from "react";

/**
 * FAQ ダッシュボード用の軽量チャート。
 *
 * 以前は recharts(gzip 約100KB・このサイト最大のチャンク)で描画していたが、
 * 必要なのは「ドーナツ1つ+横棒1つ+ホバー時のツールチップ」だけなので、
 * 手書き SVG + CSS に置き換えてチャートライブラリ依存を撤廃した。
 * 色は globals.css の --chart-* / --primary を参照し見た目を維持している。
 */

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

type TooltipState = { x: number; y: number; content: React.ReactNode } | null;

/** マウス位置に追従するツールチップ(recharts の Tooltip 相当)。 */
function useChartTooltip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const move = (e: React.MouseEvent, content: React.ReactNode) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top + 12, content });
  };

  const hide = () => setTooltip(null);

  const tooltipElement = tooltip ? (
    <div
      className="bg-popover border-border text-popover-foreground pointer-events-none absolute z-10 rounded border p-2 text-sm shadow-md"
      style={{ left: tooltip.x, top: tooltip.y }}
    >
      {tooltip.content}
    </div>
  ) : null;

  return { containerRef, move, hide, tooltipElement };
}

// --- ドーナツチャート ---------------------------------------------------

const DONUT_OUTER_R = 80;
const DONUT_INNER_R = 60;
const DONUT_PADDING_ANGLE = 5; // スライス間の隙間(度)

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
}

/** ドーナツの1スライス分の SVG パスを生成する。 */
function donutSlicePath(cx: number, cy: number, startAngle: number, endAngle: number) {
  const [x1, y1] = polarToCartesian(cx, cy, DONUT_OUTER_R, startAngle);
  const [x2, y2] = polarToCartesian(cx, cy, DONUT_OUTER_R, endAngle);
  const [x3, y3] = polarToCartesian(cx, cy, DONUT_INNER_R, endAngle);
  const [x4, y4] = polarToCartesian(cx, cy, DONUT_INNER_R, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${x1} ${y1}`,
    `A ${DONUT_OUTER_R} ${DONUT_OUTER_R} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${DONUT_INNER_R} ${DONUT_INNER_R} 0 ${largeArc} 0 ${x4} ${y4}`,
    "Z",
  ].join(" ");
}

export function DonutChart({ data }: { data: { name: string; value: number }[] }) {
  const { containerRef, move, hide, tooltipElement } = useChartTooltip();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const usableAngle = 360 - DONUT_PADDING_ANGLE * data.length;

  const sweeps = data.map((d) => (total > 0 ? (d.value / total) * usableAngle : 0));
  const slices = data.map((d, i) => {
    const start = sweeps.slice(0, i).reduce((sum, s) => sum + s, 0) + i * DONUT_PADDING_ANGLE;
    return {
      ...d,
      start,
      end: start + sweeps[i],
      color: CHART_COLORS[i % CHART_COLORS.length],
    };
  });

  return (
    <div ref={containerRef} className="relative flex h-full w-full flex-col items-center">
      <svg
        viewBox="0 0 200 200"
        className="min-h-0 w-full flex-1"
        role="img"
        aria-label="記事カテゴリーの割合"
      >
        {slices.map((slice, i) => (
          <path
            key={slice.name}
            d={donutSlicePath(100, 100, slice.start, slice.end)}
            fill={slice.color}
            className="origin-center transition-opacity duration-200"
            style={{
              opacity: activeIndex === null || activeIndex === i ? 1 : 0.5,
              animation: `fade-in-mount 0.5s ease-out ${i * 0.08}s both`,
            }}
            onMouseMove={(e) =>
              move(
                e,
                <span>
                  {slice.name} : {slice.value}
                </span>,
              )
            }
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => {
              setActiveIndex(null);
              hide();
            }}
          />
        ))}
      </svg>

      {/* Legend(recharts の Legend 相当) */}
      <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
        {slices.map((slice) => (
          <li key={slice.name} className="flex items-center gap-1.5" style={{ color: slice.color }}>
            <span
              className="inline-block h-3 w-3 rounded-[2px]"
              style={{ backgroundColor: slice.color }}
            />
            {slice.name}
          </li>
        ))}
      </ul>

      {tooltipElement}
    </div>
  );
}

// --- 横棒チャート -------------------------------------------------------

export function PhaseBarChart({ data }: { data: { name: string; value: number; tips: string }[] }) {
  const { containerRef, move, hide, tooltipElement } = useChartTooltip();
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full flex-col justify-center gap-4 py-2"
      role="img"
      aria-label="旅行フェーズ別おすすめ記事"
    >
      {data.map((d, i) => (
        <div key={d.name} className="flex items-center gap-3">
          <span className="text-foreground w-20 shrink-0 text-right text-xs leading-tight">
            {d.name}
          </span>
          <div className="min-w-0 flex-1">
            <div
              className="h-5 rounded-r-[4px]"
              style={{
                width: `${(d.value / max) * 100}%`,
                backgroundColor: "var(--primary)",
                transformOrigin: "left",
                animation: `bar-grow 0.7s ease-out ${i * 0.08}s both`,
              }}
              onMouseMove={(e) =>
                move(
                  e,
                  <div>
                    <p className="font-bold">{d.name}</p>
                    <p>{d.tips}</p>
                  </div>,
                )
              }
              onMouseLeave={hide}
            />
          </div>
        </div>
      ))}

      {tooltipElement}
    </div>
  );
}
