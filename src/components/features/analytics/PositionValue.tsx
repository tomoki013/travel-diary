import { fmtPosition } from "./format";
import { good, warn } from "./theme";

// 掲載順位の色分け: 1ページ目上位 (〜10位) は好調、〜20位は改善余地、それ以下は淡色
export function PositionValue({ position }: { position: number | null | undefined }) {
  if (position == null) return <span className="text-slate-500">-</span>;
  const tone = position <= 10 ? good : position <= 20 ? warn : "text-slate-500";
  return <span className={`font-medium ${tone}`}>{fmtPosition(position)}</span>;
}
