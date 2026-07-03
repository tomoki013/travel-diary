import type { AnalyticsWatchlistEntry } from "@/types/analytics";

// SEO 施策の効果測定リスト。/admin/analytics の「施策ウォッチ」タブが読む。
// 施策を打ったらここに追加し、十分に判定できたら削除してよい。
// 2026-07-02 の施策は PR #502 (GSC実データに基づく記事統合・再構成) 一式。
export const analyticsWatchlist: AnalyticsWatchlistEntry[] = [
  {
    path: "/posts/bangkok-tourism",
    note: "6千字超なのに表示0だったため体験ベースに全面再構成 (PR #502)",
    since: "2026-07-02",
  },
  {
    path: "/posts/paris-navigo-easy",
    note: "paris-subway を301統合して内容を集約 (PR #502)",
    since: "2026-07-02",
  },
  {
    path: "/posts/bankok-sandaijiin",
    note: "wat-pho を301統合して内容を集約 (PR #502)",
    since: "2026-07-02",
  },
  {
    path: "/posts/airport-access-donmuang",
    note: "表示0・インデックス未登録疑い。経過観察",
    since: "2026-07-02",
  },
  {
    path: "/posts/airport-access-kansai",
    note: "表示0・インデックス未登録疑い。経過観察",
    since: "2026-07-02",
  },
  {
    path: "/posts/thai-transportation",
    note: "表示0・インデックス未登録疑い。経過観察",
    since: "2026-07-02",
  },
  {
    path: "/posts/exchange-rate",
    note: "表示0・インデックス未登録疑い。経過観察",
    since: "2026-07-02",
  },
  {
    path: "/posts/vietnam-transit",
    note: "表示0・インデックス未登録疑い。経過観察",
    since: "2026-07-02",
  },
  {
    path: "/posts/bathing-ganga",
    note: "表示0・インデックス未登録疑い。経過観察",
    since: "2026-07-02",
  },
  {
    path: "/posts/shanghai-chagee-menu",
    note: "表示0・インデックス未登録疑い。経過観察",
    since: "2026-07-02",
  },
];
