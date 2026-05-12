"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface BudgetTier {
  label: string;
  dailyCost: number;
  satisfaction: number;
  description: string;
}

interface BudgetSimulatorProps {
  destination: string;
  currency: string;
  tiers: BudgetTier[];
}

export const BudgetSimulator: React.FC<BudgetSimulatorProps> = ({
  destination,
  currency,
  tiers,
}) => {
  const [days, setDays] = useState(5);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-4 w-full max-w-2xl"
    >
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-xl">
            {destination} 予算シミュレーター
            <span className="text-muted-foreground bg-muted rounded-full px-2 py-1 text-xs font-normal">
              Interactive
            </span>
          </CardTitle>
          <p className="text-muted-foreground text-xs">
            滞在日数とスタイルごとの合計予算を試算します
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Days Slider */}
          <div className="bg-primary/5 border-primary/10 space-y-3 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-bold">
                滞在日数: <span className="text-primary text-lg">{days}</span> 日間
              </label>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg"
            />
            <div className="text-muted-foreground flex justify-between px-1 text-[10px]">
              <span>1日</span>
              <span>15日</span>
              <span>30日</span>
            </div>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tiers}>
                <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as BudgetTier;
                      return (
                        <div className="bg-background rounded border p-2 text-xs shadow-sm">
                          <p className="font-bold">{data.label}</p>
                          <p>
                            合計: {(data.dailyCost * days).toLocaleString()} {currency}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="dailyCost" radius={[4, 4, 0, 0]}>
                  {tiers.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 1 ? "var(--primary)" : "var(--muted-foreground)"}
                      fillOpacity={0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className={`space-y-1 rounded-xl border p-3 transition-all ${idx === 1 ? "border-primary/50 bg-primary/5 shadow-inner" : "bg-card"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-wider uppercase opacity-70">
                    {tier.label}
                  </span>
                  <span className="text-primary text-[10px] font-bold">
                    {tier.satisfaction}% Satisfaction
                  </span>
                </div>
                <p className="font-mono text-xl font-black">
                  {(tier.dailyCost * days).toLocaleString()}
                  <span className="ml-1 font-sans text-[10px]">{currency}</span>
                </p>
                <p className="text-muted-foreground line-clamp-2 text-[10px] leading-tight">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
