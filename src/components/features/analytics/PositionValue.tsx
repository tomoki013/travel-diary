import { fmtPosition } from "./format";

// 掲載順位の色分け: 1ページ目上位 (〜10位) は好調、〜20位は改善余地、それ以下は淡色
export function PositionValue({ position }: { position: number | null | undefined }) {
  if (position == null) return <span className="text-muted-foreground">-</span>;
  const tone =
    position <= 10
      ? "text-green-600 dark:text-green-400"
      : position <= 20
        ? "text-amber-600 dark:text-amber-400"
        : "text-muted-foreground";
  return <span className={`font-medium ${tone}`}>{fmtPosition(position)}</span>;
}
