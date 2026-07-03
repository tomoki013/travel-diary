"use client";

import {
  LayoutDashboard,
  Sparkles,
  Newspaper,
  Search,
  Crosshair,
  Database,
  RefreshCw,
  Activity,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  AnalyticsSnapshot,
  AnalyticsPostInfo,
  AnalyticsWatchlistEntry,
} from "@/types/analytics";
import OverviewTab from "./OverviewTab";
import InsightsTab from "./InsightsTab";
import PagesTab from "./PagesTab";
import QueriesTab from "./QueriesTab";
import WatchlistTab from "./WatchlistTab";

interface AnalyticsDashboardProps {
  snapshot: AnalyticsSnapshot;
  watchlist: AnalyticsWatchlistEntry[];
  postInfo: Record<string, AnalyticsPostInfo>;
}

// サイドバー項目 (モバイルでは横スクロールのピル列になる)
const NAV_TRIGGER_CLASS =
  "w-auto flex-none justify-start gap-2.5 rounded-lg border-0 px-3 py-2 text-sm font-medium " +
  "text-slate-400 hover:text-slate-200 data-[state=active]:bg-slate-800/80 " +
  "data-[state=active]:text-sky-400 data-[state=active]:shadow-none " +
  "dark:text-slate-400 dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-slate-800/80 dark:data-[state=active]:text-sky-400 " +
  "lg:w-full";

export default function AnalyticsDashboard({
  snapshot,
  watchlist,
  postInfo,
}: AnalyticsDashboardProps) {
  const generatedAt = new Date(snapshot.generatedAt).toLocaleString("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    // 運営者コンソール: サイトのテーマから独立した常時ダークの画面
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
              <Activity className="size-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-50">Analytics Console</h1>
              <p className="text-xs text-slate-500">ともきちの旅行日記 — 検索とアクセスの分析</p>
            </div>
          </div>
          <div className="space-y-1 text-right text-xs text-slate-500">
            <p className="flex items-center justify-end gap-1.5">
              <Database className="size-3" />
              GSC {snapshot.gsc.range.start} 〜 {snapshot.gsc.range.end} / GA4{" "}
              {snapshot.ga4.range.start} 〜 {snapshot.ga4.range.end}
            </p>
            <p className="flex items-center justify-end gap-1.5">
              <RefreshCw className="size-3" />
              {generatedAt} 生成 — 更新は Claude に「アナリティクス更新して」
            </p>
          </div>
        </header>

        <Tabs
          defaultValue="overview"
          className="gap-6 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:items-start lg:gap-10"
        >
          <TabsList className="mb-6 h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl bg-slate-900/60 p-1.5 lg:sticky lg:top-24 lg:mb-0 lg:flex-col lg:bg-transparent lg:p-0">
            <TabsTrigger value="overview" className={NAV_TRIGGER_CLASS}>
              <LayoutDashboard className="size-4" />
              概要
            </TabsTrigger>
            <TabsTrigger value="insights" className={NAV_TRIGGER_CLASS}>
              <Sparkles className="size-4" />
              インサイト
            </TabsTrigger>
            <TabsTrigger value="pages" className={NAV_TRIGGER_CLASS}>
              <Newspaper className="size-4" />
              記事別
            </TabsTrigger>
            <TabsTrigger value="queries" className={NAV_TRIGGER_CLASS}>
              <Search className="size-4" />
              検索クエリ
            </TabsTrigger>
            <TabsTrigger value="watchlist" className={NAV_TRIGGER_CLASS}>
              <Crosshair className="size-4" />
              施策ウォッチ
            </TabsTrigger>
          </TabsList>

          <div className="min-w-0">
            <TabsContent value="overview">
              <OverviewTab snapshot={snapshot} postInfo={postInfo} />
            </TabsContent>
            <TabsContent value="insights">
              <InsightsTab snapshot={snapshot} postInfo={postInfo} />
            </TabsContent>
            <TabsContent value="pages">
              <PagesTab snapshot={snapshot} postInfo={postInfo} />
            </TabsContent>
            <TabsContent value="queries">
              <QueriesTab snapshot={snapshot} postInfo={postInfo} />
            </TabsContent>
            <TabsContent value="watchlist">
              <WatchlistTab snapshot={snapshot} watchlist={watchlist} postInfo={postInfo} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
