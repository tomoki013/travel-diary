// /admin/analytics 専用のデザイントークン。
// 運営者用コンソールとしてサイトのテーマ (stone/amber・ライト/ダーク) から独立させ、
// 常にダークな分析ツール風の配色で描画する。ここの定数だけでトーンを統一する。

/** カード (パネル) */
export const panel = "rounded-xl border border-slate-800 bg-slate-900/60";
export const panelHeader = "border-b border-slate-800/70 px-5 py-4";
export const panelBody = "px-5 py-4";
export const panelTitle = "flex items-center gap-2 text-sm font-semibold text-slate-100";
export const panelDesc = "mt-1 text-xs leading-relaxed text-slate-400";

/** テキスト */
export const textMuted = "text-slate-400";
export const textFaint = "text-slate-500";

/** テーブル */
export const th = "py-2 text-xs font-medium text-slate-500";
export const tr = "border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40";

/** バッジ */
export const badgeNeutral =
  "inline-flex items-center gap-1 rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-300";
export const badgeGood =
  "inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400";
export const badgeBad =
  "inline-flex items-center gap-1 rounded-md bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-medium text-rose-400";
export const badgeWarn =
  "inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-400";

/** 状態色 (テキスト) */
export const good = "text-emerald-400";
export const bad = "text-rose-400";
export const warn = "text-amber-400";

/** チャート用カラー (SVG に直接渡す) */
export const chart = {
  primary: "#38bdf8", // sky-400
  secondary: "#a78bfa", // violet-400
  good: "#34d399", // emerald-400
  bad: "#fb7185", // rose-400
  warn: "#fbbf24", // amber-400
  grid: "#1e293b", // slate-800
  axis: "#64748b", // slate-500
  dotStroke: "#0f172a", // slate-900 (点の縁取り)
} as const;
