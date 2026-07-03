import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsSnapshot, AnalyticsPostInfo } from "@/types/analytics";
import { DailyChart } from "./charts";
import { fmtCtr, fmtDelta, fmtInt, sumWindows } from "./format";

interface OverviewTabProps {
  snapshot: AnalyticsSnapshot;
  postInfo: Record<string, AnalyticsPostInfo>;
}

function KpiCard({
  label,
  value,
  delta,
  deltaGoodWhen,
}: {
  label: string;
  value: string;
  delta?: string | null;
  /** delta の符号がどちらなら好転か。省略時は色を付けない */
  deltaGoodWhen?: "positive" | "negative";
}) {
  const isPositive = delta?.startsWith("+");
  const good = deltaGoodWhen && (deltaGoodWhen === "positive") === isPositive;
  return (
    <Card className="gap-2 py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-muted-foreground text-xs font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="text-2xl font-bold">{value}</div>
        {delta && (
          <div
            className={`mt-1 text-xs ${
              deltaGoodWhen
                ? good
                  ? "text-green-600 dark:text-green-400"
                  : "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {delta} <span className="text-muted-foreground">vs 前28日</span>
          </div>
        )}
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

  const sessions = sumWindows(ga4.daily, ga4.range.end, (r) => r.sessions);
  const pageViews = sumWindows(ga4.daily, ga4.range.end, (r) => r.pageViews);

  const topPages = [...gsc.pages].sort((a, b) => b.clicks28 - a.clicks28).slice(0, 8);
  const topSources = [...ga4.sources].sort((a, b) => b.sessions28 - a.sessions28).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="表示回数 (28日)"
          value={fmtInt(imp.current)}
          delta={fmtDelta(imp.current, imp.previous)}
          deltaGoodWhen="positive"
        />
        <KpiCard
          label="クリック (28日)"
          value={fmtInt(clicks.current)}
          delta={fmtDelta(clicks.current, clicks.previous)}
          deltaGoodWhen="positive"
        />
        <KpiCard label="CTR (28日)" value={fmtCtr(clicks.current, imp.current)} />
        <KpiCard
          label="平均掲載順位 (28日)"
          value={position == null ? "-" : position.toFixed(1)}
          delta={
            position != null && positionPrev != null
              ? fmtDelta(Math.round(position * 10) / 10, Math.round(positionPrev * 10) / 10)
              : null
          }
          deltaGoodWhen="negative"
        />
        <KpiCard
          label="セッション (28日)"
          value={fmtInt(sessions.current)}
          delta={fmtDelta(sessions.current, sessions.previous)}
          deltaGoodWhen="positive"
        />
        <KpiCard
          label="ページビュー (28日)"
          value={fmtInt(pageViews.current)}
          delta={fmtDelta(pageViews.current, pageViews.previous)}
          deltaGoodWhen="positive"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">検索での見え方 (GSC 日次)</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyChart
              dates={gsc.daily.map((r) => r.date)}
              series={[
                {
                  name: "表示回数",
                  color: "var(--primary)",
                  values: gsc.daily.map((r) => r.impressions),
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
            <CardTitle className="text-base">サイト訪問 (GA4 日次)</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyChart
              dates={ga4.daily.map((r) => r.date)}
              series={[
                {
                  name: "ページビュー",
                  color: "var(--primary)",
                  values: ga4.daily.map((r) => r.pageViews),
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
            <CardTitle className="text-base">クリック上位ページ (28日)</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left text-xs">
                  <th className="py-1.5 font-medium">ページ</th>
                  <th className="py-1.5 text-right font-medium">クリック</th>
                  <th className="py-1.5 text-right font-medium">表示</th>
                  <th className="py-1.5 text-right font-medium">CTR</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page) => (
                  <tr key={page.path} className="border-b last:border-0">
                    <td className="max-w-0 truncate py-1.5 pr-2" title={page.path}>
                      {postInfo[page.path]?.title ?? page.path}
                    </td>
                    <td className="py-1.5 text-right tabular-nums">{fmtInt(page.clicks28)}</td>
                    <td className="py-1.5 text-right tabular-nums">{fmtInt(page.impressions28)}</td>
                    <td className="py-1.5 text-right tabular-nums">
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
            <CardTitle className="text-base">流入元 (GA4 28日)</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left text-xs">
                  <th className="py-1.5 font-medium">参照元 / メディア</th>
                  <th className="py-1.5 text-right font-medium">セッション (28日)</th>
                  <th className="py-1.5 text-right font-medium">全期間</th>
                </tr>
              </thead>
              <tbody>
                {topSources.map((source) => (
                  <tr key={`${source.source}/${source.medium}`} className="border-b last:border-0">
                    <td className="py-1.5 pr-2">
                      {source.source} / {source.medium}
                    </td>
                    <td className="py-1.5 text-right tabular-nums">{fmtInt(source.sessions28)}</td>
                    <td className="py-1.5 text-right tabular-nums">{fmtInt(source.sessions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
