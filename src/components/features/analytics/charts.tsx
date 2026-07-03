// /admin/analytics 用の軽量 SVG チャート。
// 管理画面専用なのでチャートライブラリは追加せず自前描画で済ませる。

import { useId } from "react";
import { fmtShortDate } from "./format";

export interface ChartSeries {
  name: string;
  color: string; // CSS color (var(--primary) など)
  values: (number | null)[];
  /** 最初の系列などに面グラデーションを敷く場合 true */
  area?: boolean;
}

interface DailyChartProps {
  dates: string[];
  series: ChartSeries[];
  height?: number;
}

/** 軸の最大値を 1/2/2.5/5×10^n の「キリのいい数」へ丸める */
function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const exp = Math.floor(Math.log10(value));
  const base = Math.pow(10, exp);
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (value <= m * base) return m * base;
  }
  return 10 * base;
}

/** 日次推移の折れ線チャート (系列で y スケール共有・面グラデーション対応) */
export function DailyChart({ dates, series, height = 200 }: DailyChartProps) {
  const gradientId = useId();
  const width = 720;
  const pad = { top: 14, right: 12, bottom: 24, left: 46 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const allValues = series.flatMap((s) => s.values).filter((v): v is number => v != null);
  const maxY = niceCeil(Math.max(1, ...allValues));
  const x = (i: number) => pad.left + (dates.length <= 1 ? 0 : (i / (dates.length - 1)) * innerW);
  const y = (v: number) => pad.top + innerH - (v / maxY) * innerH;

  const linePath = (values: (number | null)[]) =>
    values
      .map((v, i) => (v == null ? null : `${x(i)},${y(v)}`))
      .filter((p): p is string => p != null)
      .map((p, i) => `${i === 0 ? "M" : "L"}${p}`)
      .join(" ");

  // x軸ラベルは重なりを避けて 6 個程度に間引く
  const labelStep = Math.max(1, Math.ceil(dates.length / 6));
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => Math.round(maxY * r));

  return (
    <figure>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={series.map((s) => s.name).join(" / ")}
      >
        <defs>
          {series.map(
            (s, si) =>
              s.area && (
                <linearGradient key={s.name} id={`${gradientId}-${si}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
                </linearGradient>
              ),
          )}
        </defs>

        {yTicks.map((tick, ti) => (
          <g key={tick}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray={ti === 0 ? undefined : "3 4"}
            />
            <text
              x={pad.left - 8}
              y={y(tick) + 4}
              textAnchor="end"
              fontSize="11"
              fill="var(--muted-foreground)"
            >
              {tick.toLocaleString("ja-JP")}
            </text>
          </g>
        ))}
        {dates.map((date, i) =>
          i % labelStep === 0 ? (
            <text
              key={date}
              x={x(i)}
              y={height - 6}
              textAnchor="middle"
              fontSize="11"
              fill="var(--muted-foreground)"
            >
              {fmtShortDate(date)}
            </text>
          ) : null,
        )}

        {series.map((s, si) => {
          const d = linePath(s.values);
          const lastIdx = s.values.reduce<number>((acc, v, i) => (v == null ? acc : i), -1);
          return (
            <g key={s.name}>
              {s.area && d && (
                <path
                  d={`${d} L${x(s.values.length - 1)},${y(0)} L${x(0)},${y(0)} Z`}
                  fill={`url(#${gradientId}-${si})`}
                  stroke="none"
                />
              )}
              <path
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {lastIdx >= 0 && (
                <circle
                  cx={x(lastIdx)}
                  cy={y(s.values[lastIdx] as number)}
                  r="3.5"
                  fill={s.color}
                  stroke="var(--card)"
                  strokeWidth="1.5"
                />
              )}
            </g>
          );
        })}

        {/* ホバーで日別値を出すための透明ヒットエリア */}
        {dates.map((date, i) => (
          <rect
            key={date}
            x={x(i) - innerW / dates.length / 2}
            y={pad.top}
            width={innerW / dates.length}
            height={innerH}
            fill="transparent"
          >
            <title>
              {`${date}\n${series.map((s) => `${s.name}: ${s.values[i] ?? "-"}`).join("\n")}`}
            </title>
          </rect>
        ))}
      </svg>
      <figcaption className="text-muted-foreground mt-2 flex gap-4 text-xs">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.name}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

interface SparklineProps {
  values: number[];
  /** この index 以降が「施策後」であることを示す縦線を引く (省略可) */
  markerIndex?: number;
  width?: number;
  height?: number;
}

/** テーブル行内の小さな推移表示 (面グラデーション付き) */
export function Sparkline({ values, markerIndex, width = 96, height = 28 }: SparklineProps) {
  const gradientId = useId();
  if (values.length === 0 || values.every((v) => v === 0)) {
    return <span className="text-muted-foreground text-xs">-</span>;
  }
  const max = Math.max(1, ...values);
  const x = (i: number) => (values.length <= 1 ? 0 : (i / (values.length - 1)) * (width - 4)) + 2;
  const y = (v: number) => height - 3 - (v / max) * (height - 7);
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const last = values.length - 1;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={`${x(0)},${height - 2} ${points} ${x(last)},${height - 2}`}
        fill={`url(#${gradientId})`}
        stroke="none"
      />
      {markerIndex != null && markerIndex >= 0 && markerIndex < values.length && (
        <line
          x1={x(markerIndex)}
          x2={x(markerIndex)}
          y1={2}
          y2={height - 2}
          stroke="var(--destructive)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={x(last)}
        cy={y(values[last])}
        r="2"
        fill="var(--primary)"
        stroke="var(--card)"
        strokeWidth="1"
      />
    </svg>
  );
}
