// /admin/analytics 用の軽量 SVG チャート。
// 管理画面専用なのでチャートライブラリは追加せず自前描画で済ませる。

import { fmtShortDate } from "./format";

export interface ChartSeries {
  name: string;
  color: string; // CSS color (var(--primary) など)
  values: (number | null)[];
}

interface DailyChartProps {
  dates: string[];
  series: ChartSeries[];
  height?: number;
}

/** 日次推移の折れ線チャート。系列ごとに y スケールを独立させず共有する */
export function DailyChart({ dates, series, height = 180 }: DailyChartProps) {
  const width = 720;
  const pad = { top: 10, right: 10, bottom: 22, left: 42 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const allValues = series.flatMap((s) => s.values).filter((v): v is number => v != null);
  const maxY = Math.max(1, ...allValues);
  const x = (i: number) => pad.left + (dates.length <= 1 ? 0 : (i / (dates.length - 1)) * innerW);
  const y = (v: number) => pad.top + innerH - (v / maxY) * innerH;

  // x軸ラベルは overlapping を避けて 6 個程度に間引く
  const labelStep = Math.max(1, Math.ceil(dates.length / 6));
  const yTicks = [0, 0.5, 1].map((r) => Math.round(maxY * r));

  return (
    <figure>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={series.map((s) => s.name).join(" / ")}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text
              x={pad.left - 6}
              y={y(tick) + 4}
              textAnchor="end"
              fontSize="11"
              fill="var(--muted-foreground)"
            >
              {tick}
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
        {series.map((s) => {
          const d = s.values
            .map((v, i) => (v == null ? null : `${x(i)},${y(v)}`))
            .filter((p): p is string => p != null)
            .map((p, i) => `${i === 0 ? "M" : "L"}${p}`)
            .join(" ");
          return (
            <path key={s.name} d={d} fill="none" stroke={s.color} strokeWidth="2">
              <title>{s.name}</title>
            </path>
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
      <figcaption className="text-muted-foreground mt-1 flex gap-4 text-xs">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4" style={{ backgroundColor: s.color }} />
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

/** テーブル行内の小さな推移表示 */
export function Sparkline({ values, markerIndex, width = 96, height = 24 }: SparklineProps) {
  if (values.length === 0 || values.every((v) => v === 0)) {
    return <span className="text-muted-foreground text-xs">-</span>;
  }
  const max = Math.max(1, ...values);
  const x = (i: number) => (values.length <= 1 ? 0 : (i / (values.length - 1)) * (width - 2)) + 1;
  const y = (v: number) => height - 2 - (v / max) * (height - 4);
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true">
      {markerIndex != null && markerIndex >= 0 && markerIndex < values.length && (
        <line
          x1={x(markerIndex)}
          x2={x(markerIndex)}
          y1={0}
          y2={height}
          stroke="var(--destructive)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      )}
      <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth="1.5" />
    </svg>
  );
}
