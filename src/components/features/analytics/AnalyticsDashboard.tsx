"use client";

import { LayoutDashboard, Newspaper, Search, Crosshair, Database, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  AnalyticsSnapshot,
  AnalyticsPostInfo,
  AnalyticsWatchlistEntry,
} from "@/types/analytics";
import OverviewTab from "./OverviewTab";
import PagesTab from "./PagesTab";
import QueriesTab from "./QueriesTab";
import WatchlistTab from "./WatchlistTab";

interface AnalyticsDashboardProps {
  snapshot: AnalyticsSnapshot;
  watchlist: AnalyticsWatchlistEntry[];
  postInfo: Record<string, AnalyticsPostInfo>;
}

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
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Analytics</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1 font-normal">
              <Database className="size-3" />
              GSC {snapshot.gsc.range.start} 〜 {snapshot.gsc.range.end}
            </Badge>
            <Badge variant="outline" className="gap-1 font-normal">
              <Database className="size-3" />
              GA4 {snapshot.ga4.range.start} 〜 {snapshot.ga4.range.end}
            </Badge>
          </div>
        </div>
        <div className="text-muted-foreground flex items-start gap-1.5 text-xs">
          <RefreshCw className="mt-0.5 size-3 shrink-0" />
          <p>
            スナップショット生成: {generatedAt}
            <br />
            更新は Claude に「アナリティクス更新して」と依頼
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-5 h-10 w-full sm:w-fit">
          <TabsTrigger value="overview" className="gap-1.5 px-3">
            <LayoutDashboard className="size-4" />
            概要
          </TabsTrigger>
          <TabsTrigger value="pages" className="gap-1.5 px-3">
            <Newspaper className="size-4" />
            記事別
          </TabsTrigger>
          <TabsTrigger value="queries" className="gap-1.5 px-3">
            <Search className="size-4" />
            検索クエリ
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="gap-1.5 px-3">
            <Crosshair className="size-4" />
            施策ウォッチ
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab snapshot={snapshot} postInfo={postInfo} />
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
