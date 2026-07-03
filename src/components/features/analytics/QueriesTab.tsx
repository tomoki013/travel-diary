import type { AnalyticsSnapshot, AnalyticsPostInfo } from "@/types/analytics";
import { fmtCtr, fmtInt } from "./format";
import { PositionValue } from "./PositionValue";
import { panel, panelBody, panelHeader, panelTitle, panelDesc, th, tr } from "./theme";

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
          <tr className="border-b border-slate-800 text-left">
            <th className={`${th} w-6`}>#</th>
            <th className={th}>検索クエリ</th>
            <th className={th}>ページ</th>
            <th className={`${th} text-right`}>表示 (28日)</th>
            <th className={`${th} text-right`}>クリック</th>
            <th className={`${th} text-right`}>CTR</th>
            <th className={`${th} text-right`}>順位 (28日)</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-6 text-center text-slate-500">
                該当するクエリがありません
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={`${row.query}|${row.path}`} className={tr}>
                <td className="py-2 text-xs text-slate-500 tabular-nums">{i + 1}</td>
                <td className="py-2 pr-2 font-medium text-slate-200">{row.query}</td>
                <td className="max-w-56 truncate py-2 pr-2 text-xs text-slate-400" title={row.path}>
                  {postInfo[row.path]?.title ?? row.path}
                </td>
                <td className="py-2 text-right text-slate-100 tabular-nums">
                  {fmtInt(row.impressions28)}
                </td>
                <td className="py-2 text-right text-slate-100 tabular-nums">
                  {fmtInt(row.clicks28)}
                </td>
                <td className="py-2 text-right text-slate-400 tabular-nums">
                  {fmtCtr(row.clicks28, row.impressions28)}
                </td>
                <td className="py-2 text-right tabular-nums">
                  <PositionValue position={row.position28} />
                </td>
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
    <div className="space-y-5">
      <section className={panel}>
        <div className={panelHeader}>
          <h2 className={panelTitle}>あと一歩のキーワード</h2>
          <p className={panelDesc}>
            順位4〜20位で表示回数があるのに1ページ目上位に届いていないクエリ。該当記事のリライト候補。
          </p>
        </div>
        <div className={panelBody}>
          <QueryTable rows={strikingDistance} postInfo={postInfo} />
        </div>
      </section>

      <section className={panel}>
        <div className={panelHeader}>
          <h2 className={panelTitle}>トップクエリ</h2>
          <p className={panelDesc}>
            直近28日のクリック順。匿名化されたクエリ (プライバシー保護で非公開のもの) は含まれない。
          </p>
        </div>
        <div className={panelBody}>
          <QueryTable rows={topQueries} postInfo={postInfo} />
        </div>
      </section>
    </div>
  );
}
