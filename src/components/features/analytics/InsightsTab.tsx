import {
  PenLine,
  Type,
  SearchX,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsSnapshot, AnalyticsPostInfo } from "@/types/analytics";
import { buildInsights } from "./insights";
import { fmtInt, fmtPct } from "./format";
import { PositionValue } from "./PositionValue";

interface InsightsTabProps {
  snapshot: AnalyticsSnapshot;
  postInfo: Record<string, AnalyticsPostInfo>;
}

function PageLink({
  path,
  postInfo,
}: {
  path: string;
  postInfo: Record<string, AnalyticsPostInfo>;
}) {
  return (
    <a
      href={path}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-1 font-medium hover:underline"
      title={path}
    >
      {postInfo[path]?.title ?? path}
      <ExternalLink className="text-muted-foreground size-3 opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  );
}

export default function InsightsTab({ snapshot, postInfo }: InsightsTabProps) {
  const insights = buildInsights(snapshot, postInfo);
  const actionCount =
    insights.rewrites.length + insights.ctrGaps.length + insights.indexSuspects.length;

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Sparkles className="text-primary size-4" />
        直近28日のデータから自動抽出した改善アクション {actionCount} 件。上から効果が大きい順。
      </div>

      {/* 1. リライト候補 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PenLine className="text-primary size-4" />
            リライトで1ページ目上位を狙える記事
            <Badge variant="secondary">{insights.rewrites.length}</Badge>
          </CardTitle>
          <CardDescription>
            順位4〜20位のクエリを記事ごとに束ね、3位相当まで上がった場合に見込めるクリック増 (+n/月)
            でスコア化。数字が大きいものからリライトすると効率が良い。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.rewrites.length === 0 && (
            <p className="text-muted-foreground text-sm">対象なし</p>
          )}
          {insights.rewrites.map((c, i) => (
            <div
              key={c.path}
              className="border-border/70 flex items-start justify-between gap-4 rounded-lg border p-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-4 shrink-0 text-xs tabular-nums">
                    {i + 1}
                  </span>
                  <PageLink path={c.path} postInfo={postInfo} />
                </div>
                <ul className="text-muted-foreground mt-1.5 ml-6 space-y-0.5 text-xs">
                  {c.queries.map((q) => (
                    <li key={q.query} className="flex items-center gap-2">
                      <span className="truncate">「{q.query}」</span>
                      <span className="shrink-0 tabular-nums">
                        {fmtInt(q.impressions28)} 表示 / <PositionValue position={q.position28} />{" "}
                        位
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-primary text-lg font-bold tabular-nums">
                  +{fmtInt(c.potentialClicks)}
                </div>
                <div className="text-muted-foreground text-[10px]">見込みクリック/月</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 2. タイトル改善候補 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Type className="text-primary size-4" />
            タイトル・説明文の改善候補
            <Badge variant="secondary">{insights.ctrGaps.length}</Badge>
          </CardTitle>
          <CardDescription>
            順位は取れているのに、その順位の期待値よりクリック率が大きく低いクエリ。
            検索結果での見出し (title / description) が刺さっていない可能性が高い。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insights.ctrGaps.length === 0 ? (
            <p className="text-muted-foreground text-sm">対象なし</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b text-left text-xs">
                    <th className="py-2 font-medium">検索クエリ</th>
                    <th className="py-2 font-medium">ページ</th>
                    <th className="py-2 text-right font-medium">順位</th>
                    <th className="py-2 text-right font-medium">実CTR</th>
                    <th className="py-2 text-right font-medium">期待CTR</th>
                    <th className="py-2 text-right font-medium">逃したクリック/月</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.ctrGaps.map((g) => (
                    <tr
                      key={`${g.query}|${g.path}`}
                      className="hover:bg-muted/50 border-b last:border-0"
                    >
                      <td className="py-2 pr-2 font-medium">{g.query}</td>
                      <td
                        className="text-muted-foreground max-w-48 truncate py-2 pr-2 text-xs"
                        title={g.path}
                      >
                        {postInfo[g.path]?.title ?? g.path}
                      </td>
                      <td className="py-2 text-right tabular-nums">
                        <PositionValue position={g.position28} />
                      </td>
                      <td className="text-destructive py-2 text-right font-medium tabular-nums">
                        {fmtPct(g.actualCtr)}
                      </td>
                      <td className="text-muted-foreground py-2 text-right tabular-nums">
                        {fmtPct(g.expectedCtr)}
                      </td>
                      <td className="py-2 text-right font-medium tabular-nums">
                        {fmtInt(g.missedClicks)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. 伸びている / 落ちている */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-green-600 dark:text-green-400" />
              伸びているページ
              <Badge variant="secondary">{insights.rising.length}</Badge>
            </CardTitle>
            <CardDescription>直近2週の表示回数がその前2週から +30% 以上</CardDescription>
          </CardHeader>
          <CardContent>
            <MomentumList entries={insights.rising} postInfo={postInfo} tone="up" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingDown className="text-destructive size-4" />
              落ちているページ
              <Badge variant="secondary">{insights.falling.length}</Badge>
            </CardTitle>
            <CardDescription>
              直近2週の表示回数がその前2週から -30% 以下。順位下落や検索需要の変化を確認
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MomentumList entries={insights.falling} postInfo={postInfo} tone="down" />
          </CardContent>
        </Card>
      </div>

      {/* 4. インデックス問題 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <SearchX className="text-destructive size-4" />
            検索に出ていない実用記事
            <Badge variant="secondary">{insights.indexSuspects.length}</Badge>
          </CardTitle>
          <CardDescription>
            観光・旅程などの実用カテゴリなのに全期間で表示0。インデックス未登録の疑いがあるので、
            Search Console の URL 検査で状態を確認 → 必要ならインデックス登録をリクエストする。
            (カバレッジの理由は BigQuery に来ないため GSC の UI でしか見られない)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insights.indexSuspects.length === 0 ? (
            <p className="text-muted-foreground text-sm">対象なし 🎉</p>
          ) : (
            <ul className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
              {insights.indexSuspects.map((s) => (
                <li key={s.path} className="flex items-center gap-2">
                  <span className="bg-destructive inline-block size-1.5 shrink-0 rounded-full" />
                  <span className="truncate">
                    <PageLink path={s.path} postInfo={postInfo} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MomentumList({
  entries,
  postInfo,
  tone,
}: {
  entries: [string, { recent: number; prior: number; changeRatio: number | null }][];
  postInfo: Record<string, AnalyticsPostInfo>;
  tone: "up" | "down";
}) {
  if (entries.length === 0) {
    return <p className="text-muted-foreground text-sm">対象なし</p>;
  }
  return (
    <ul className="space-y-2 text-sm">
      {entries.slice(0, 8).map(([path, m]) => (
        <li key={path} className="flex items-baseline justify-between gap-3">
          <span className="min-w-0 truncate">
            <PageLink path={path} postInfo={postInfo} />
          </span>
          <span
            className={`shrink-0 text-xs font-medium tabular-nums ${
              tone === "up" ? "text-green-600 dark:text-green-400" : "text-destructive"
            }`}
          >
            {fmtInt(m.prior)} → {fmtInt(m.recent)}
            {m.changeRatio != null &&
              ` (${m.changeRatio > 0 ? "+" : ""}${Math.round(m.changeRatio * 100)}%)`}
          </span>
        </li>
      ))}
    </ul>
  );
}
