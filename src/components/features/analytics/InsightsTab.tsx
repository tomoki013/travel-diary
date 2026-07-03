import {
  PenLine,
  Type,
  SearchX,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ExternalLink,
  BarChart3,
  Crosshair as ScatterIcon,
  Rocket,
} from "lucide-react";
import type { AnalyticsSnapshot, AnalyticsPostInfo } from "@/types/analytics";
import { buildInsights, expectedCtr } from "./insights";
import { fmtInt, fmtPct } from "./format";
import { PositionValue } from "./PositionValue";
import { BarList, ScatterChart } from "./charts";
import {
  panel,
  panelBody,
  panelHeader,
  panelTitle,
  panelDesc,
  th,
  tr,
  chart,
  badgeNeutral,
  bad,
} from "./theme";

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
      className="group inline-flex items-center gap-1 font-medium text-slate-200 hover:text-sky-400 hover:underline"
      title={path}
    >
      {postInfo[path]?.title ?? path}
      <ExternalLink className="size-3 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  );
}

export default function InsightsTab({ snapshot, postInfo }: InsightsTabProps) {
  const insights = buildInsights(snapshot, postInfo);
  const actionCount =
    insights.rewrites.length + insights.ctrGaps.length + insights.indexSuspects.length;

  // CTR×順位の散布図 (28日で表示10回以上のクエリ)
  const scatterRows = snapshot.gsc.queries.filter(
    (q) => q.position28 != null && q.position28 <= 20 && q.impressions28 >= 10,
  );
  const scatterPoints = scatterRows.map((q) => {
    const ctr = q.clicks28 / q.impressions28;
    const under = ctr < expectedCtr(q.position28!) * 0.6;
    return {
      x: q.position28!,
      y: ctr,
      color: under ? chart.bad : chart.primary,
      size: Math.min(8, 3 + Math.sqrt(q.impressions28) / 4),
      label: `「${q.query}」\n順位 ${q.position28} / CTR ${fmtPct(ctr)} (期待 ${fmtPct(expectedCtr(q.position28!))})\n${fmtInt(q.impressions28)} 表示 / ${fmtInt(q.clicks28)} クリック`,
    };
  });
  const maxCtr = Math.max(0.3, ...scatterPoints.map((p) => p.y)) * 1.1;
  const curve = Array.from({ length: 39 }, (_, i) => {
    const pos = 1 + i * 0.5;
    return { x: pos, y: expectedCtr(pos) };
  });

  const health = insights.queryHealth;

  return (
    <div className="space-y-5">
      {/* サマリー: アクション数とクエリ健康度 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <div className={`${panel} px-4 py-3`}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sparkles className="size-3.5 text-sky-400" />
            改善アクション
          </div>
          <div className="mt-1 text-2xl font-bold text-sky-400 tabular-nums">{actionCount}</div>
        </div>
        <div className={`${panel} px-4 py-3`}>
          <div className="text-xs text-slate-400">検索クエリ数 (28日)</div>
          <div className="mt-1 text-2xl font-bold text-slate-50 tabular-nums">
            {fmtInt(health.total)}
          </div>
        </div>
        <div className={`${panel} px-4 py-3`}>
          <div className="text-xs text-slate-400">TOP3 クエリ</div>
          <div className="mt-1 text-2xl font-bold text-emerald-400 tabular-nums">
            {fmtInt(health.top3)}
          </div>
        </div>
        <div className={`${panel} px-4 py-3`}>
          <div className="text-xs text-slate-400">TOP10 クエリ</div>
          <div className="mt-1 text-2xl font-bold text-slate-50 tabular-nums">
            {fmtInt(health.top10)}
          </div>
        </div>
        <div className={`${panel} px-4 py-3`}>
          <div className="text-xs text-slate-400">11〜20位 (あと一歩)</div>
          <div className="mt-1 text-2xl font-bold text-amber-400 tabular-nums">
            {fmtInt(health.striking)}
          </div>
        </div>
      </div>

      {/* 1. リライト候補 */}
      <section className={panel}>
        <div className={panelHeader}>
          <h2 className={panelTitle}>
            <PenLine className="size-4 text-sky-400" />
            リライトで1ページ目上位を狙える記事
            <span className={badgeNeutral}>{insights.rewrites.length}</span>
          </h2>
          <p className={panelDesc}>
            順位4〜20位のクエリを記事ごとに束ね、3位相当まで上がった場合に見込めるクリック増 (+n/月)
            でスコア化。数字が大きいものからリライトすると効率が良い。
          </p>
        </div>
        <div className={`${panelBody} space-y-2.5`}>
          {insights.rewrites.length === 0 && <p className="text-sm text-slate-500">対象なし</p>}
          {insights.rewrites.map((c, i) => (
            <div
              key={c.path}
              className="flex items-start justify-between gap-4 rounded-lg border border-slate-800/70 bg-slate-950/40 p-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-4 shrink-0 text-xs text-slate-500 tabular-nums">{i + 1}</span>
                  <PageLink path={c.path} postInfo={postInfo} />
                </div>
                <ul className="mt-1.5 ml-6 space-y-0.5 text-xs text-slate-400">
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
                <div className="text-lg font-bold text-sky-400 tabular-nums">
                  +{fmtInt(c.potentialClicks)}
                </div>
                <div className="text-[10px] text-slate-500">見込みクリック/月</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. CTR×順位の散布図 + 順位分布 */}
      <div className="grid gap-5 xl:grid-cols-3">
        <section className={`${panel} xl:col-span-2`}>
          <div className={panelHeader}>
            <h2 className={panelTitle}>
              <ScatterIcon className="size-4 text-sky-400" />
              CTR × 掲載順位
            </h2>
            <p className={panelDesc}>
              直近28日で10回以上表示されたクエリ。点線の期待CTRカーブより大きく下 (赤点)
              はタイトル改善候補。点の大きさは表示回数。
            </p>
          </div>
          <div className={panelBody}>
            <ScatterChart
              points={scatterPoints}
              curve={curve}
              curveLabel="順位ごとの期待CTR"
              xLabel="掲載順位"
              yLabel="CTR"
              xMax={20}
              yMax={maxCtr}
              xTicks={[1, 5, 10, 15, 20]}
              formatY={(v) => `${Math.round(v * 100)}%`}
            />
          </div>
        </section>

        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={panelTitle}>
              <BarChart3 className="size-4 text-sky-400" />
              順位の分布
            </h2>
            <p className={panelDesc}>直近28日に表示のあったクエリ×ページ数</p>
          </div>
          <div className={panelBody}>
            <BarList
              items={insights.positionDistribution.map((b, i) => ({
                label: b.label,
                value: b.count,
                color: [chart.good, chart.primary, chart.warn, "#94a3b8", "#64748b"][i],
                hint: `表示回数合計 ${fmtInt(b.impressions)}`,
              }))}
            />
          </div>
        </section>
      </div>

      {/* 3. タイトル改善候補 */}
      <section className={panel}>
        <div className={panelHeader}>
          <h2 className={panelTitle}>
            <Type className="size-4 text-sky-400" />
            タイトル・説明文の改善候補
            <span className={badgeNeutral}>{insights.ctrGaps.length}</span>
          </h2>
          <p className={panelDesc}>
            順位は取れているのに、その順位の期待値よりクリック率が大きく低いクエリ。 検索結果での
            見出し (title / description) が刺さっていない可能性が高い。
          </p>
        </div>
        <div className={panelBody}>
          {insights.ctrGaps.length === 0 ? (
            <p className="text-sm text-slate-500">対象なし</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left">
                    <th className={th}>検索クエリ</th>
                    <th className={th}>ページ</th>
                    <th className={`${th} text-right`}>順位</th>
                    <th className={`${th} text-right`}>実CTR</th>
                    <th className={`${th} text-right`}>期待CTR</th>
                    <th className={`${th} text-right`}>逃したクリック/月</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.ctrGaps.map((g) => (
                    <tr key={`${g.query}|${g.path}`} className={tr}>
                      <td className="py-2 pr-2 font-medium text-slate-200">{g.query}</td>
                      <td
                        className="max-w-48 truncate py-2 pr-2 text-xs text-slate-400"
                        title={g.path}
                      >
                        {postInfo[g.path]?.title ?? g.path}
                      </td>
                      <td className="py-2 text-right tabular-nums">
                        <PositionValue position={g.position28} />
                      </td>
                      <td className={`py-2 text-right font-medium tabular-nums ${bad}`}>
                        {fmtPct(g.actualCtr)}
                      </td>
                      <td className="py-2 text-right text-slate-400 tabular-nums">
                        {fmtPct(g.expectedCtr)}
                      </td>
                      <td className="py-2 text-right font-medium text-slate-100 tabular-nums">
                        {fmtInt(g.missedClicks)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* 4. 新出クエリ */}
      <section className={panel}>
        <div className={panelHeader}>
          <h2 className={panelTitle}>
            <Rocket className="size-4 text-sky-400" />
            新しく検索に出始めたクエリ
            <span className={badgeNeutral}>{insights.newQueries.length}</span>
          </h2>
          <p className={panelDesc}>
            表示のすべてが直近28日に集中しているクエリ = 新しく評価され始めた検索語。
            需要が伸びているテーマなら、専用記事化や加筆で先行できる。
          </p>
        </div>
        <div className={panelBody}>
          {insights.newQueries.length === 0 ? (
            <p className="text-sm text-slate-500">対象なし</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left">
                    <th className={th}>検索クエリ</th>
                    <th className={th}>ページ</th>
                    <th className={`${th} text-right`}>表示 (28日)</th>
                    <th className={`${th} text-right`}>クリック</th>
                    <th className={`${th} text-right`}>順位</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.newQueries.map((q) => (
                    <tr key={`${q.query}|${q.path}`} className={tr}>
                      <td className="py-2 pr-2 font-medium text-slate-200">{q.query}</td>
                      <td
                        className="max-w-48 truncate py-2 pr-2 text-xs text-slate-400"
                        title={q.path}
                      >
                        {postInfo[q.path]?.title ?? q.path}
                      </td>
                      <td className="py-2 text-right tabular-nums">{fmtInt(q.impressions28)}</td>
                      <td className="py-2 text-right tabular-nums">{fmtInt(q.clicks28)}</td>
                      <td className="py-2 text-right tabular-nums">
                        <PositionValue position={q.position28} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* 5. 伸びている / 落ちている */}
      <div className="grid gap-5 xl:grid-cols-2">
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={panelTitle}>
              <TrendingUp className="size-4 text-emerald-400" />
              伸びているページ
              <span className={badgeNeutral}>{insights.rising.length}</span>
            </h2>
            <p className={panelDesc}>直近2週の表示回数がその前2週から +30% 以上</p>
          </div>
          <div className={panelBody}>
            <MomentumList entries={insights.rising} postInfo={postInfo} tone="up" />
          </div>
        </section>
        <section className={panel}>
          <div className={panelHeader}>
            <h2 className={panelTitle}>
              <TrendingDown className="size-4 text-rose-400" />
              落ちているページ
              <span className={badgeNeutral}>{insights.falling.length}</span>
            </h2>
            <p className={panelDesc}>
              直近2週の表示回数がその前2週から -30% 以下。順位下落や検索需要の変化を確認
            </p>
          </div>
          <div className={panelBody}>
            <MomentumList entries={insights.falling} postInfo={postInfo} tone="down" />
          </div>
        </section>
      </div>

      {/* 6. インデックス問題 */}
      <section className={panel}>
        <div className={panelHeader}>
          <h2 className={panelTitle}>
            <SearchX className="size-4 text-rose-400" />
            検索に出ていない実用記事
            <span className={badgeNeutral}>{insights.indexSuspects.length}</span>
          </h2>
          <p className={panelDesc}>
            観光・旅程などの実用カテゴリなのに全期間で表示0。インデックス未登録の疑いがあるので、
            Search Console の URL 検査で状態を確認 → 必要ならインデックス登録をリクエストする。
            (カバレッジの理由は BigQuery に来ないため GSC の UI でしか見られない)
          </p>
        </div>
        <div className={panelBody}>
          {insights.indexSuspects.length === 0 ? (
            <p className="text-sm text-slate-500">対象なし 🎉</p>
          ) : (
            <ul className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
              {insights.indexSuspects.map((s) => (
                <li key={s.path} className="flex items-center gap-2">
                  <span className="inline-block size-1.5 shrink-0 rounded-full bg-rose-400" />
                  <span className="truncate">
                    <PageLink path={s.path} postInfo={postInfo} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
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
    return <p className="text-sm text-slate-500">対象なし</p>;
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
              tone === "up" ? "text-emerald-400" : "text-rose-400"
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
