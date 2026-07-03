"use client";

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
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            GSC: {snapshot.gsc.range.start} 〜 {snapshot.gsc.range.end} / GA4:{" "}
            {snapshot.ga4.range.start} 〜 {snapshot.ga4.range.end}
          </p>
        </div>
        <p className="text-muted-foreground text-xs">
          スナップショット生成: {generatedAt}
          <br />
          更新は <code>node scripts/generate-analytics-snapshot.mjs</code> (Claude に依頼可)
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="pages">記事別</TabsTrigger>
          <TabsTrigger value="queries">検索クエリ</TabsTrigger>
          <TabsTrigger value="watchlist">施策ウォッチ</TabsTrigger>
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
