import {
  Eye,
  MousePointerClick,
  Percent,
  BarChart3,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  LogOut,
  MousePointer2,
} from "lucide-react";
import type { AnalyticsSnapshot, AnalyticsPostInfo } from "@/types/analytics";
import { DailyChart, Sparkline, BarList } from "./charts";
import { fmtCtr, fmtEngagementSec, fmtExitRate, fmtInt, sumWindows } from "./format";
import { buildWeekdayPattern } from "./insights";
import {
  panel,
  panelBody,
  panelHeader,
  panelTitle,
  panelDesc,
  th,
  tr,
  chart,
  good,
  bad,
} from "./theme";

interface OverviewTabProps {
  snapshot: AnalyticsSnapshot;
  postInfo: Record<string, AnalyticsPostInfo>;
}

// GA4 拡張計測イベントのうち「読者の操作」と言えるものだけを表示する
// (page_view/session_start/first_visit/user_engagement は自動計測のノイズなので除外)
const INTERACTION_EVENT_LABELS: Record<string, string> = {
  scroll: "スクロール (90%到達)",
  click: "外部リンククリック",
  form_start: "フォーム入力開始",
};

function KpiCard({
  label,
  value,
  icon: Icon,
  diff,
  diffLabel,
  goodWhen,
  spark,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  diff?: number;
  diffLabel?: string;
  goodWhen?: "positive" | "negative";
  spark?: number[];
}) {
  const showDiff = diff != null && diff !== 0;
  const isGood = goodWhen && (goodWhen === "positive") === (diff ?? 0) > 0;
  return (
    <div className={`${panel} px-4 py-3.5`}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <div className="text-2xl font-bold text-slate-50 tabular-nums">{value}</div>
        {spark && spark.some((v) => v > 0) && (
          <div className="mb-0.5 hidden opacity-90 sm:block">
            <Sparkline values={spark} width={64} height={22} />
          </div>
        )}
      </div>
      <div className="mt-1 flex min-h-4 items-center gap-1 text-xs">
        {showDiff && (
          <>
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                goodWhen ? (isGood ? good : bad) : "text-slate-400"
              }`}
            >
              {(diff ?? 0) > 0 ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {diffLabel}
            </span>
            <span className="text-slate-500">vs 前28日</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function OverviewTab({ snapshot, postInfo }: OverviewTabProps) {
  const { gsc, ga4 } = snapshot;

  const imp = sumWindows(gsc.daily, gsc.range.end, (r) => r.impressions);
  const clicks = sumWindows(gsc.daily, gsc.range.end, (r) => r.clicks);
  // 平均掲載順位は表示回数で重み付けした加重平均
  const posWeighted = sumWindows(gsc.daily, gsc.range.end, (r) =>
    r.position == null ? 0 : r.position * r.impressions,
  );
  const position = imp.current > 0 ? posWeighted.current / imp.current : null;
  const positionPrev = imp.previous > 0 ? posWeighted.previous / imp.previous : null;
  const positionDiff =
    position != null && positionPrev != null
      ? Math.round((position - positionPrev) * 10) / 10
      : undefined;

  const sessions = sumWindows(ga4.daily, ga4.range.end, (r) => r.sessions);
  const pageViews = sumWindows(ga4.daily, ga4.range.end, (r) => r.pageViews);

  const topPages = [...gsc.pages].sort((a, b) => b.clicks28 - a.clicks28).slice(0, 8);
  const topSources = [...ga4.sources].sort((a, b) => b.sessions28 - a.sessions28).slice(0, 8);

  const gscSpark = gsc.daily.slice(-28);
  const ga4Spark = ga4.daily.slice(-28);

  const weekdayImpressions = buildWeekdayPattern(gsc.daily, (r) => r.impressions);
  const weekdaySessions = buildWeekdayPattern(ga4.daily, (r) => r.sessions);

  const interactionEvents = ga4.events.filter((e) => e.eventName in INTERACTION_EVENT_LABELS);
  const topExitPages = [...ga4.pages]
    .filter((p) => p.views28 >= 10)
    .sort((a, b) => b.exits28 / b.views28 - a.exits28 / a.views28)
    .slice(0, 8);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="表示回数 (28日)"
          value={fmtInt(imp.current)}
          icon={Eye}
          diff={imp.current - imp.previous}
          diffLabel={fmtInt(Math.abs(imp.current - imp.previous))}
          goodWhen="positive"
          spark={gscSpark.map((r) => r.impressions)}
        />
        <KpiCard
          label="クリック (28日)"
          value={fmtInt(clicks.current)}
          icon={MousePointerClick}
          diff={clicks.current - clicks.previous}
          diffLabel={fmtInt(Math.abs(clicks.current - clicks.previous))}
          goodWhen="positive"
          spark={gscSpark.map((r) => r.clicks)}
        />
        <KpiCard label="CTR (28日)" value={fmtCtr(clicks.current, imp.current)} icon={Percent} />
        <KpiCard
          label="平均掲載順位 (28日)"
          value={position == null ? "-" : position.toFixed(1)}
          icon={BarChart3}
          diff={positionDiff}
          diffLabel={positionDiff != null ? Math.abs(positionDiff).toFixed(1) : undefined}
          goodWhen="negative"
        />
        <KpiCard
          label="セッション (28日)"
          value={fmtInt(sessions.current)}
          icon={Users}
          diff={sessions.current - sessions.previous}
          diffLabel={fmtInt(Math.abs(sessions.current - sessions.previous))}
          goodWhen="positive"
          spark={ga4Spark.map((r) => r.sessions)}
        />
        <KpiCard
          label="ページビュー (28日)"
          value={fmtInt(pageViews.current)}
          icon={FileText}
          diff={pageViews.current - pageViews.previous}
          diffLabel={fmtInt(Math.abs(pageViews.current - pageViews.previous))}
          goodWhen="positive"
          spark={ga4Spark.map((r) => r.pageViews)}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={panelTitle}>検索での見え方</h2>
            <p className={panelDesc}>Google Search Console の日次推移</p>
          </div>
          <div className={panelBody}>
            <DailyChart
              dates={gsc.daily.map((r) => r.date)}
              series={[
                {
                  name: "表示回数",
                  color: chart.primary,
                  values: gsc.daily.map((r) => r.impressions),
                  area: true,
                },
                {
                  name: "クリック",
                  color: chart.secondary,
                  values: gsc.daily.map((r) => r.clicks),
                },
              ]}
            />
          </div>
        </section>

        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={panelTitle}>サイト訪問</h2>
            <p className={panelDesc}>GA4 の日次推移（Cookie 同意ユーザーのみ計測）</p>
          </div>
          <div className={panelBody}>
            <DailyChart
              dates={ga4.daily.map((r) => r.date)}
              series={[
                {
                  name: "ページビュー",
                  color: chart.primary,
                  values: ga4.daily.map((r) => r.pageViews),
                  area: true,
                },
                {
                  name: "セッション",
                  color: chart.secondary,
                  values: ga4.daily.map((r) => r.sessions),
                },
              ]}
            />
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className={`${panel} xl:col-span-2`}>
          <div className={panelHeader}>
            <h2 className={panelTitle}>クリック上位ページ</h2>
            <p className={panelDesc}>直近28日の検索クリック順</p>
          </div>
          <div className={panelBody}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className={`${th} w-6`}>#</th>
                  <th className={`${th} w-1/2`}>ページ</th>
                  <th className={`${th} text-right`}>クリック</th>
                  <th className={`${th} text-right`}>表示</th>
                  <th className={`${th} text-right`}>CTR</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, i) => (
                  <tr key={page.path} className={tr}>
                    <td className="py-2 text-xs text-slate-500 tabular-nums">{i + 1}</td>
                    <td className="max-w-0 truncate py-2 pr-2 text-slate-200" title={page.path}>
                      {postInfo[page.path]?.title ?? page.path}
                    </td>
                    <td className="py-2 text-right font-medium text-slate-100 tabular-nums">
                      {fmtInt(page.clicks28)}
                    </td>
                    <td className="py-2 text-right text-slate-400 tabular-nums">
                      {fmtInt(page.impressions28)}
                    </td>
                    <td className="py-2 text-right text-slate-400 tabular-nums">
                      {fmtCtr(page.clicks28, page.impressions28)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={panelTitle}>流入元</h2>
            <p className={panelDesc}>直近28日のセッション数 (GA4)</p>
          </div>
          <div className={panelBody}>
            <BarList
              items={topSources.map((s) => ({
                label: `${s.source} / ${s.medium}`,
                value: s.sessions28,
                hint: `全期間 ${fmtInt(s.sessions)}`,
              }))}
            />
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className={`${panel} xl:col-span-2`}>
          <div className={panelHeader}>
            <h2 className={panelTitle}>
              <LogOut className="size-4 text-sky-400" />
              離脱率の高いページ
            </h2>
            <p className={panelDesc}>
              直近28日でPV10以上のページを、そのページがセッション内最後の閲覧だった割合の高い順に表示。
              高い記事は次の記事への導線 (関連記事・内部リンク) を見直す候補。
            </p>
          </div>
          <div className={panelBody}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className={`${th} w-1/2`}>ページ</th>
                  <th className={`${th} text-right`}>PV (28日)</th>
                  <th className={`${th} text-right`}>滞在/PV</th>
                  <th className={`${th} text-right`}>離脱率</th>
                </tr>
              </thead>
              <tbody>
                {topExitPages.map((page) => (
                  <tr key={page.path} className={tr}>
                    <td className="max-w-0 truncate py-2 pr-2 text-slate-200" title={page.path}>
                      {postInfo[page.path]?.title ?? page.path}
                    </td>
                    <td className="py-2 text-right text-slate-400 tabular-nums">
                      {fmtInt(page.views28)}
                    </td>
                    <td className="py-2 text-right text-slate-400 tabular-nums">
                      {fmtEngagementSec(page.engagementMs28, page.views28)}
                    </td>
                    <td className="py-2 text-right font-medium text-slate-100 tabular-nums">
                      {fmtExitRate(page.exits28, page.views28)}
                    </td>
                  </tr>
                ))}
                {topExitPages.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-3 text-center text-slate-500">
                      対象なし (PV10以上のページがまだありません)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={panelTitle}>
              <MousePointer2 className="size-4 text-sky-400" />
              読者の操作 (28日)
            </h2>
            <p className={panelDesc}>GA4 拡張計測イベント。スクロール・外部リンク・フォーム開始</p>
          </div>
          <div className={panelBody}>
            <BarList
              items={interactionEvents.map((e) => ({
                label: INTERACTION_EVENT_LABELS[e.eventName],
                value: e.count28,
                hint: `全期間 ${fmtInt(e.count)}`,
              }))}
            />
          </div>
        </section>
      </div>

      <section className={panel}>
        <div className={panelHeader}>
          <h2 className={panelTitle}>
            <CalendarDays className="size-4 text-sky-400" />
            曜日パターン
          </h2>
          <p className={panelDesc}>
            曜日ごとの1日平均。読者が動く曜日が分かるので、公開・SNS告知のタイミングの参考に。
          </p>
        </div>
        <div className={`${panelBody} grid gap-8 sm:grid-cols-2`}>
          <div>
            <h3 className="mb-3 text-xs font-medium text-slate-400">検索表示回数 / 日 (GSC)</h3>
            <BarList items={weekdayImpressions} />
          </div>
          <div>
            <h3 className="mb-3 text-xs font-medium text-slate-400">セッション / 日 (GA4)</h3>
            <BarList items={weekdaySessions.map((w) => ({ ...w, color: chart.secondary }))} />
          </div>
        </div>
      </section>
    </div>
  );
}
