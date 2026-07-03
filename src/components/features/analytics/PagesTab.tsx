"use client";

import { useMemo, useState } from "react";
import { ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AnalyticsSnapshot, AnalyticsPostInfo } from "@/types/analytics";
import { Sparkline } from "./charts";
import { fmtCtr, fmtEngagementSec, fmtInt } from "./format";
import { computeMomentum, type MomentumResult } from "./insights";
import { PositionValue } from "./PositionValue";

interface PagesTabProps {
  snapshot: AnalyticsSnapshot;
  postInfo: Record<string, AnalyticsPostInfo>;
}

interface PageRow {
  path: string;
  title: string;
  category: string | null; // null = 記事以外のページ
  noindex: boolean;
  impressions: number;
  impressions28: number;
  clicks28: number;
  position28: number | null;
  views28: number;
  engagementMs28: number;
  weekly: number[];
  momentum: MomentumResult;
}

/** 直近2週 vs その前2週の傾向アイコン */
function MomentumCell({ momentum }: { momentum: MomentumResult }) {
  if (momentum.momentum === "rising") {
    return (
      <span
        className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600 dark:text-green-400"
        title={`直近2週 ${momentum.recent} / その前2週 ${momentum.prior}`}
      >
        <TrendingUp className="size-3.5" />
        {momentum.changeRatio != null && `+${Math.round(momentum.changeRatio * 100)}%`}
      </span>
    );
  }
  if (momentum.momentum === "falling") {
    return (
      <span
        className="text-destructive inline-flex items-center gap-0.5 text-xs font-medium"
        title={`直近2週 ${momentum.recent} / その前2週 ${momentum.prior}`}
      >
        <TrendingDown className="size-3.5" />
        {momentum.changeRatio != null && `${Math.round(momentum.changeRatio * 100)}%`}
      </span>
    );
  }
  if (momentum.momentum === "flat") {
    return <Minus className="text-muted-foreground size-3.5" />;
  }
  return <span className="text-muted-foreground text-xs">-</span>;
}

type SortKey = "impressions28" | "clicks28" | "position28" | "views28" | "impressions";

const CATEGORY_LABELS: Record<string, string> = {
  tourism: "観光",
  itinerary: "旅程",
  series: "日記",
  "one-off": "単発",
};

export default function PagesTab({ snapshot, postInfo }: PagesTabProps) {
  const [search, setSearch] = useState("");
  const [excludeDiary, setExcludeDiary] = useState(false);
  const [postsOnly, setPostsOnly] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("impressions28");

  const rows = useMemo(() => {
    const gscByPath = new Map(snapshot.gsc.pages.map((r) => [r.path, r]));
    const ga4ByPath = new Map(snapshot.ga4.pages.map((r) => [r.path, r]));
    const weeklyByPath = new Map<string, number[]>();
    const weeks = [...new Set(snapshot.gsc.pagesWeekly.map((r) => r.week))].sort();
    for (const r of snapshot.gsc.pagesWeekly) {
      if (!weeklyByPath.has(r.path)) weeklyByPath.set(r.path, new Array(weeks.length).fill(0));
      weeklyByPath.get(r.path)![weeks.indexOf(r.week)] = r.impressions;
    }

    // 記事全件 + GSC/GA4 に現れた記事以外のページ を行にする
    const paths = new Set<string>([
      ...Object.keys(postInfo),
      ...gscByPath.keys(),
      ...ga4ByPath.keys(),
    ]);

    const result: PageRow[] = [];
    for (const path of paths) {
      const info = postInfo[path];
      const gsc = gscByPath.get(path);
      const ga4 = ga4ByPath.get(path);
      const weekly = weeklyByPath.get(path) ?? [];
      result.push({
        momentum: computeMomentum(weeks, weekly, snapshot.gsc.range.end),
        path,
        title: info?.title ?? path,
        category: info?.category ?? null,
        noindex: info?.noindex ?? false,
        impressions: gsc?.impressions ?? 0,
        impressions28: gsc?.impressions28 ?? 0,
        clicks28: gsc?.clicks28 ?? 0,
        position28: gsc?.position28 ?? null,
        views28: ga4?.views28 ?? 0,
        engagementMs28: ga4?.engagementMs28 ?? 0,
        weekly,
      });
    }
    return result;
  }, [snapshot, postInfo]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows
      .filter((row) => {
        if (postsOnly && row.category == null) return false;
        if (excludeDiary && row.category === "series") return false;
        if (query && !row.title.toLowerCase().includes(query) && !row.path.includes(query))
          return false;
        return true;
      })
      .sort((a, b) => {
        if (sortKey === "position28") {
          // 順位は小さいほど良い。null (表示なし) は末尾へ
          if (a.position28 == null) return 1;
          if (b.position28 == null) return -1;
          return a.position28 - b.position28;
        }
        return b[sortKey] - a[sortKey];
      });
  }, [rows, search, excludeDiary, postsOnly, sortKey]);

  const sortableHeader = (key: SortKey, label: string) => (
    <th
      className={`cursor-pointer py-2 text-right font-medium select-none ${
        sortKey === key ? "text-foreground" : "hover:text-foreground"
      }`}
      onClick={() => setSortKey(key)}
      title="クリックでソート"
    >
      <span className="inline-flex items-center gap-0.5">
        {label}
        {sortKey === key && <ChevronDown className="size-3" />}
      </span>
    </th>
  );

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="タイトル・パスで絞り込み"
            className="max-w-xs"
          />
          <label className="flex cursor-pointer items-center gap-1.5 text-sm">
            <input
              type="checkbox"
              className="accent-primary size-3.5"
              checked={postsOnly}
              onChange={(e) => setPostsOnly(e.target.checked)}
            />
            記事のみ
          </label>
          <label className="flex cursor-pointer items-center gap-1.5 text-sm">
            <input
              type="checkbox"
              className="accent-primary size-3.5"
              checked={excludeDiary}
              onChange={(e) => setExcludeDiary(e.target.checked)}
            />
            日記 (series) を除く
          </label>
          <span className="text-muted-foreground ml-auto text-xs tabular-nums">
            {filtered.length} 件
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left text-xs">
                <th className="py-2 font-medium">ページ</th>
                {sortableHeader("impressions28", "表示 (28日)")}
                {sortableHeader("clicks28", "クリック")}
                <th className="py-2 text-right font-medium">CTR</th>
                {sortableHeader("position28", "順位")}
                {sortableHeader("views28", "PV (GA4)")}
                <th className="py-2 text-right font-medium">滞在/PV</th>
                {sortableHeader("impressions", "表示 (全期間)")}
                <th className="py-2 pl-4 text-center font-medium">傾向</th>
                <th className="py-2 pl-2 font-medium">週次推移</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                // 実用カテゴリなのに全期間表示0 = インデックス問題の疑い
                const invisible =
                  row.impressions === 0 &&
                  !row.noindex &&
                  row.category != null &&
                  row.category !== "series";
                return (
                  <tr key={row.path} className="hover:bg-muted/50 border-b last:border-0">
                    <td className="max-w-64 py-2 pr-2">
                      <div className="truncate" title={row.path}>
                        <a
                          href={row.path}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium hover:underline"
                        >
                          {row.title}
                        </a>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="text-muted-foreground max-w-48 truncate text-xs">
                          {row.path}
                        </span>
                        {row.category && (
                          <Badge variant="outline" className="px-1 py-0 text-[10px]">
                            {CATEGORY_LABELS[row.category] ?? row.category}
                          </Badge>
                        )}
                        {row.noindex && (
                          <Badge variant="secondary" className="px-1 py-0 text-[10px]">
                            noindex
                          </Badge>
                        )}
                        {invisible && (
                          <Badge variant="destructive" className="px-1 py-0 text-[10px]">
                            表示0
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-2 text-right tabular-nums">{fmtInt(row.impressions28)}</td>
                    <td className="py-2 text-right tabular-nums">{fmtInt(row.clicks28)}</td>
                    <td className="text-muted-foreground py-2 text-right tabular-nums">
                      {fmtCtr(row.clicks28, row.impressions28)}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      <PositionValue position={row.position28} />
                    </td>
                    <td className="py-2 text-right tabular-nums">{fmtInt(row.views28)}</td>
                    <td className="text-muted-foreground py-2 text-right tabular-nums">
                      {fmtEngagementSec(row.engagementMs28, row.views28)}
                    </td>
                    <td className="text-muted-foreground py-2 text-right tabular-nums">
                      {fmtInt(row.impressions)}
                    </td>
                    <td className="py-2 pl-4 text-center">
                      <MomentumCell momentum={row.momentum} />
                    </td>
                    <td className="py-2 pl-2">
                      <Sparkline values={row.weekly} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
