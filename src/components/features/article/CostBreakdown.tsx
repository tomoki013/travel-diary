import { Wallet, Plane, Hotel, UtensilsCrossed, Train, Car, Camera, Ellipsis } from "lucide-react";
import React from "react";

// 親コンポーネントから受け取るpropsの型定義
type CostBreakdownProps = {
  costs: { [key: string]: number };
};

// カテゴリキーと日本語名、アイコンをマッピング
const categoryMap: {
  [key: string]: { label: string; icon: React.ElementType };
} = {
  flight: { label: "航空券", icon: Plane },
  hotel: { label: "宿泊費", icon: Hotel },
  food: { label: "食費", icon: UtensilsCrossed },
  train: { label: "鉄道", icon: Train },
  transport: { label: "交通費", icon: Car },
  sightseeing: { label: "観光", icon: Camera },
  other: { label: "その他", icon: Ellipsis },
};

/**
 * 費用の内訳を視覚的に表示するためのカードコンポーネント
 */
const CostBreakdown = ({ costs }: CostBreakdownProps) => {
  // costsオブジェクトが存在しない、または空の場合は何も表示しない
  if (!costs || Object.keys(costs).length === 0) {
    return null;
  }

  // 合計金額を計算
  const totalCost = Object.values(costs).reduce((sum, current) => sum + current, 0);

  // 金額の大きい順にソート
  const sortedCosts = Object.entries(costs).sort(([, a], [, b]) => b - a);

  return (
    <details className="group bg-muted border-secondary my-6 rounded-lg border-l-4 p-6">
      <summary className="flex cursor-pointer list-none items-center transition-opacity hover:opacity-80">
        <div className="text-foreground h-5 w-5 transition-transform duration-300 group-open:rotate-90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-full w-full"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <Wallet className="text-foreground h-5 w-5" />
          <h3 className="text-foreground text-lg font-bold">費用の内訳</h3>
        </div>
      </summary>
      <ul className="space-y-4">
        {sortedCosts.map(([categoryKey, amount]) => {
          const { label, icon: Icon } = categoryMap[categoryKey] || {
            label: categoryKey,
            icon: Ellipsis,
          };
          const percentage = totalCost > 0 ? (amount / totalCost) * 100 : 0;
          return (
            <li key={categoryKey}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center font-medium">
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </span>
                <span className="font-semibold">{amount.toLocaleString()}円</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-2 rounded-full bg-teal-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </li>
          );
        })}
      </ul>
      {/* 合計金額セクション */}
      <div className="mt-4 flex items-center justify-between border-t pt-4 text-base font-bold">
        <span>合計金額</span>
        <span>{totalCost.toLocaleString()}円</span>
      </div>
    </details>
  );
};

export default CostBreakdown;
