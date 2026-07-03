import {
  Eye,
  MousePointerClick,
  Percent,
  BarChart3,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsSnapshot, AnalyticsPostInfo } from "@/types/analytics";
import { DailyChart, Sparkline } from "./charts";
import { fmtCtr, fmtInt, sumWindows } from "./format";

interface OverviewTabProps {
  snapshot: AnalyticsSnapshot;
  postInfo: Record<string, AnalyticsPostInfo>;
}

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
  /** 前28日との差分 (表示しない場合は undefined) */
  diff?: number;
  diffLabel?: string;
  /** diff の符号がどちらなら好転か。省略時は色を付けない */
  goodWhen?: "positive" | "negative";
  /** 直近28日の日次ミニ推移 (省略可) */
  spark?: number[];
}) {
  const showDiff = diff != null && diff !== 0;
  const good = goodWhen && (goodWhen === "positive") === (diff ?? 0) > 0;
  return (
    <Card className="gap-1 py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
          <Icon className="size-3.5" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex items-end justify-between gap-2">
          <div className="font-heading text-2xl font-bold tabular-nums">{value}</div>
          {spark && spark.some((v) => v > 0) && (
            <div className="mb-0.5 hidden opacity-80 sm:block">
              <Sparkline values={spark} width={64} height={22} />
            </div>
          )}
        </div>
        <div className="mt-1 flex min-h-4 items-center gap-1 text-xs">
          {showDiff && (
            <>
              <span
                className={`inline-flex items-center gap-0.5 font-medium ${
                  goodWhen
                    ? good
                      ? "text-green-600 dark:text-green-400"
                      : "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {(diff ?? 0) > 0 ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {diffLabel}
              </span>
              <span className="text-muted-foreground">vs 前28日</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
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
  const maxSourceSessions = Math.max(1, ...topSources.map((s) => s.sessions28));

  // KPI カード内のミニ推移 (直近28日の日次)
  const gscSpark = gsc.daily.slice(-28);
  const ga4Spark = ga4.daily.slice(-28);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">検索での見え方</CardTitle>
            <CardDescription>Google Search Console の日次推移</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyChart
              dates={gsc.daily.map((r) => r.date)}
              series={[
                {
                  name: "表示回数",
                  color: "var(--primary)",
                  values: gsc.daily.map((r) => r.impressions),
                  area: true,
                },
                {
                  name: "クリック",
                  color: "var(--secondary)",
                  values: gsc.daily.map((r) => r.clicks),
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">サイト訪問</CardTitle>
            <CardDescription>GA4 の日次推移（Cookie 同意ユーザーのみ計測）</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyChart
              dates={ga4.daily.map((r) => r.date)}
              series={[
                {
                  name: "ページビュー",
                  color: "var(--primary)",
                  values: ga4.daily.map((r) => r.pageViews),
                  area: true,
                },
                {
                  name: "セッション",
                  color: "var(--secondary)",
                  values: ga4.daily.map((r) => r.sessions),
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">クリック上位ページ</CardTitle>
            <CardDescription>直近28日の検索クリック順</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left text-xs">
                  <th className="w-6 py-2 font-medium">#</th>
                  <th className="w-1/2 py-2 font-medium">ページ</th>
                  <th className="py-2 text-right font-medium">クリック</th>
                  <th className="py-2 text-right font-medium">表示</th>
                  <th className="py-2 text-right font-medium">CTR</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, i) => (
                  <tr key={page.path} className="hover:bg-muted/50 border-b last:border-0">
                    <td className="text-muted-foreground py-2 text-xs tabular-nums">{i + 1}</td>
                    <td className="max-w-0 truncate py-2 pr-2" title={page.path}>
                      {postInfo[page.path]?.title ?? page.path}
                    </td>
                    <td className="py-2 text-right font-medium tabular-nums">
                      {fmtInt(page.clicks28)}
                    </td>
                    <td className="text-muted-foreground py-2 text-right tabular-nums">
                      {fmtInt(page.impressions28)}
                    </td>
                    <td className="text-muted-foreground py-2 text-right tabular-nums">
                      {fmtCtr(page.clicks28, page.impressions28)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">流入元</CardTitle>
            <CardDescription>直近28日のセッション数 (GA4)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {topSources.map((source) => (
              <div key={`${source.source}/${source.medium}`} className="text-sm">
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="truncate">
                    {source.source}
                    <span className="text-muted-foreground text-xs"> / {source.medium}</span>
                  </span>
                  <span className="font-medium tabular-nums">{fmtInt(source.sessions28)}</span>
                </div>
                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${(source.sessions28 / maxSourceSessions) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
