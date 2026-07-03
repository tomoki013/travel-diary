"use client";

import {
  LayoutDashboard,
  Sparkles,
  Newspaper,
  Search,
  Crosshair,
  Database,
  RefreshCw,
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

const TAB_TRIGGER_CLASS =
  "text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-primary " +
  "h-auto flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent px-3 pt-1.5 pb-2.5 " +
  "text-sm font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none " +
  "dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent";

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
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-primary text-[11px] font-semibold tracking-[0.18em] uppercase">
            Site Analytics
          </p>
          <h1 className="font-heading mt-1 text-3xl font-bold">検索とアクセスの分析</h1>
          <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1">
              <Database className="size-3" />
              GSC {snapshot.gsc.range.start} 〜 {snapshot.gsc.range.end}
            </span>
            <span className="inline-flex items-center gap-1">
              <Database className="size-3" />
              GA4 {snapshot.ga4.range.start} 〜 {snapshot.ga4.range.end}
            </span>
            <span className="inline-flex items-center gap-1">
              <RefreshCw className="size-3" />
              {generatedAt} 生成 — 更新は Claude に「アナリティクス更新して」
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6 h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="overview" className={TAB_TRIGGER_CLASS}>
            <LayoutDashboard className="size-4" />
            概要
          </TabsTrigger>
          <TabsTrigger value="insights" className={TAB_TRIGGER_CLASS}>
            <Sparkles className="size-4" />
            インサイト
          </TabsTrigger>
          <TabsTrigger value="pages" className={TAB_TRIGGER_CLASS}>
            <Newspaper className="size-4" />
            記事別
          </TabsTrigger>
          <TabsTrigger value="queries" className={TAB_TRIGGER_CLASS}>
            <Search className="size-4" />
            検索クエリ
          </TabsTrigger>
          <TabsTrigger value="watchlist" className={TAB_TRIGGER_CLASS}>
            <Crosshair className="size-4" />
            施策ウォッチ
          </TabsTrigger>
        </TabsList>
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
      </Tabs>
    </div>
  );
}
