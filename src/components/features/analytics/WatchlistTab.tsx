import { TrendingUp, TrendingDown, Minus, EyeOff } from "lucide-react";
import type {
  AnalyticsSnapshot,
  AnalyticsPostInfo,
  AnalyticsWatchlistEntry,
} from "@/types/analytics";
import { Sparkline } from "./charts";
import { fmtDelta, fmtInt } from "./format";
import { PositionValue } from "./PositionValue";
import { panel, panelBody, panelHeader, badgeNeutral, badgeGood, badgeBad } from "./theme";

interface WatchlistTabProps {
  snapshot: AnalyticsSnapshot;
  watchlist: AnalyticsWatchlistEntry[];
  postInfo: Record<string, AnalyticsPostInfo>;
}

/** 直近28日 vs 前28日の表示回数から経過ステータスを判定する */
function getStatus(impressions28: number, impressionsPrev28: number) {
  if (impressions28 === 0 && impressionsPrev28 === 0) {
    return { label: "表示なし", icon: EyeOff, className: badgeBad };
  }
  const diff = impressions28 - impressionsPrev28;
  const ratio = impressionsPrev28 > 0 ? diff / impressionsPrev28 : 1;
  if (ratio >= 0.1) {
    return { label: "改善", icon: TrendingUp, className: badgeGood };
  }
  if (ratio <= -0.1) {
    return { label: "悪化", icon: TrendingDown, className: badgeBad };
  }
  return { label: "横ばい", icon: Minus, className: badgeNeutral };
}

export default function WatchlistTab({ snapshot, watchlist, postInfo }: WatchlistTabProps) {
  const gscByPath = new Map(snapshot.gsc.pages.map((r) => [r.path, r]));
  const weeks = [...new Set(snapshot.gsc.pagesWeekly.map((r) => r.week))].sort();
  const weeklyByPath = new Map<string, number[]>();
  for (const r of snapshot.gsc.pagesWeekly) {
    if (!weeklyByPath.has(r.path)) weeklyByPath.set(r.path, new Array(weeks.length).fill(0));
    weeklyByPath.get(r.path)![weeks.indexOf(r.week)] = r.impressions;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        SEO施策を打った記事の経過観察リスト (
        <code className="text-xs text-slate-300">src/data/analytics/watchlist.ts</code> で管理)。
        点線は施策日。検索結果への反映には通常2〜8週間かかるため、施策直後の数値では判断しないこと。
      </p>
      <div className="grid gap-4 xl:grid-cols-2">
        {watchlist.map((entry) => {
          const gsc = gscByPath.get(entry.path);
          const weekly = weeklyByPath.get(entry.path) ?? [];
          // 施策日を含む週の index (スパークラインの点線位置)
          const markerIndex = weeks.findIndex(
            (week) => entry.since >= week && entry.since < addDays(week, 7),
          );
          const impDelta = gsc ? fmtDelta(gsc.impressions28, gsc.impressionsPrev28) : null;
          const status = getStatus(gsc?.impressions28 ?? 0, gsc?.impressionsPrev28 ?? 0);
          const StatusIcon = status.icon;

          return (
            <section key={entry.path} className={panel}>
              <div className={`${panelHeader} pb-3`}>
                <div className="flex items-start justify-between gap-2">
                  <a
                    href={entry.path}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-slate-100 hover:text-sky-400 hover:underline"
                  >
                    {postInfo[entry.path]?.title ?? entry.path}
                  </a>
                  <span className={`${status.className} shrink-0`}>
                    <StatusIcon className="size-3" />
                    {status.label}
                  </span>
                </div>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                  <span className={badgeNeutral}>{entry.since} 施策</span>
                  {entry.note}
                </p>
              </div>
              <div className={`${panelBody} flex items-end justify-between gap-4 py-3.5`}>
                <dl className="grid grid-cols-3 gap-x-6 gap-y-1 text-sm">
                  <dt className="col-start-1 text-xs text-slate-500">表示 (28日)</dt>
                  <dt className="text-xs text-slate-500">クリック (28日)</dt>
                  <dt className="text-xs text-slate-500">順位 (28日)</dt>
                  <dd className="col-start-1 font-semibold text-slate-100 tabular-nums">
                    {fmtInt(gsc?.impressions28 ?? 0)}
                    {impDelta && (
                      <span className="ml-1 text-xs font-normal text-slate-500">({impDelta})</span>
                    )}
                  </dd>
                  <dd className="font-semibold text-slate-100 tabular-nums">
                    {fmtInt(gsc?.clicks28 ?? 0)}
                  </dd>
                  <dd className="font-semibold tabular-nums">
                    <PositionValue position={gsc?.position28 ?? null} />
                  </dd>
                </dl>
                <div className="shrink-0">
                  <Sparkline
                    values={weekly}
                    markerIndex={markerIndex === -1 ? undefined : markerIndex}
                    width={130}
                    height={36}
                  />
                  <div className="mt-0.5 text-right text-[10px] text-slate-500">週次表示回数</div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/** YYYY-MM-DD に日数を足した YYYY-MM-DD を返す */
function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
