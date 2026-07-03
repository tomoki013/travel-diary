import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsSnapshot, AnalyticsPostInfo } from "@/types/analytics";
import { fmtCtr, fmtInt, fmtPosition } from "./format";

interface QueriesTabProps {
  snapshot: AnalyticsSnapshot;
  postInfo: Record<string, AnalyticsPostInfo>;
}

function QueryTable({
  rows,
  postInfo,
}: {
  rows: AnalyticsSnapshot["gsc"]["queries"];
  postInfo: Record<string, AnalyticsPostInfo>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="text-muted-foreground border-b text-left text-xs">
            <th className="py-1.5 font-medium">検索クエリ</th>
            <th className="py-1.5 font-medium">ページ</th>
            <th className="py-1.5 text-right font-medium">表示 (28日)</th>
            <th className="py-1.5 text-right font-medium">クリック</th>
            <th className="py-1.5 text-right font-medium">CTR</th>
            <th className="py-1.5 text-right font-medium">順位 (28日)</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-muted-foreground py-4 text-center">
                該当するクエリがありません
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={`${row.query}|${row.path}`} className="border-b last:border-0">
                <td className="py-1.5 pr-2 font-medium">{row.query}</td>
                <td
                  className="text-muted-foreground max-w-56 truncate py-1.5 pr-2"
                  title={row.path}
                >
                  {postInfo[row.path]?.title ?? row.path}
                </td>
                <td className="py-1.5 text-right tabular-nums">{fmtInt(row.impressions28)}</td>
                <td className="py-1.5 text-right tabular-nums">{fmtInt(row.clicks28)}</td>
                <td className="py-1.5 text-right tabular-nums">
                  {fmtCtr(row.clicks28, row.impressions28)}
                </td>
                <td className="py-1.5 text-right tabular-nums">{fmtPosition(row.position28)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function QueriesTab({ snapshot, postInfo }: QueriesTabProps) {
  // あと一歩: 順位4〜20位で表示がそこそこある = リライトで1ページ目を狙える
  const strikingDistance = snapshot.gsc.queries
    .filter(
      (row) =>
        row.position28 != null &&
        row.position28 >= 4 &&
        row.position28 <= 20 &&
        row.impressions28 >= 5,
    )
    .sort((a, b) => b.impressions28 - a.impressions28)
    .slice(0, 30);

  const topQueries = [...snapshot.gsc.queries]
    .filter((row) => row.impressions28 > 0)
    .sort((a, b) => b.clicks28 - a.clicks28 || b.impressions28 - a.impressions28)
    .slice(0, 50);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">あと一歩のキーワード (順位4〜20位)</CardTitle>
          <CardDescription>
            表示回数があるのに1ページ目上位に届いていないクエリ。該当記事のリライト候補。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QueryTable rows={strikingDistance} postInfo={postInfo} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">トップクエリ (直近28日)</CardTitle>
          <CardDescription>
            クリック順。匿名化されたクエリ (プライバシー保護で非公開のもの) は含まれない。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QueryTable rows={topQueries} postInfo={postInfo} />
        </CardContent>
      </Card>
    </div>
  );
}
