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
      className="w-full max-w-2xl my-4"
    >
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex justify-between items-center">
            {destination} 予算シミュレーター
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">Interactive</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">滞在日数とスタイルごとの合計予算を試算します</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Days Slider */}
          <div className="space-y-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold flex items-center gap-2">
                滞在日数: <span className="text-primary text-lg">{days}</span> 日間
              </label>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={days} 
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
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
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as BudgetTier;
                      return (
                        <div className="bg-background border p-2 rounded shadow-sm text-xs">
                          <p className="font-bold">{data.label}</p>
                          <p>合計: {(data.dailyCost * days).toLocaleString()} {currency}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {tiers.map((tier, idx) => (
              <div key={idx} className={`p-3 border rounded-xl space-y-1 transition-all ${idx === 1 ? 'border-primary/50 bg-primary/5 shadow-inner' : 'bg-card'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-70">{tier.label}</span>
                  <span className="text-[10px] font-bold text-primary">{tier.satisfaction}% Satisfaction</span>
                </div>
                <p className="text-xl font-black font-mono">
                  {((tier.dailyCost * days)).toLocaleString()}
                  <span className="text-[10px] ml-1 font-sans">{currency}</span>
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
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
