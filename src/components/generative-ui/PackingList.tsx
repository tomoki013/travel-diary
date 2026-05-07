"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Briefcase, Wind, Umbrella, ThermometerSnowflake } from "lucide-react";

interface PackingItem {
  item: string;
  category: string;
  reason: string;
  essential: boolean;
}

interface PackingListProps {
  destination: string;
  season: string;
  items: PackingItem[];
}

export const PackingList: React.FC<PackingListProps> = ({
  destination,
  season,
  items,
}) => {
  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl my-4"
    >
      <Card className="border-dashed border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            {destination} ({season}) 持ち物チェックリスト
          </CardTitle>
          <p className="text-xs text-muted-foreground">現地のアドバイスに基づいたおすすめのパッキング</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categories.map(cat => (
              <div key={cat} className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-tighter bg-muted px-2 py-0.5 rounded w-fit">{cat}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {items.filter(i => i.category === cat).map((i, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <Checkbox id={`${cat}-${idx}`} className="mt-1" />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={`${cat}-${idx}`}
                          className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                          {i.item}
                          {i.essential && <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded font-black">MUST</span>}
                        </Label>
                        <p className="text-xs text-muted-foreground italic">
                          {i.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 bg-blue-50 rounded-lg flex items-center gap-3 border border-blue-100">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <ThermometerSnowflake className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-[10px] text-blue-700 leading-tight">
              <strong>アドバイス:</strong> {season}の{destination}は朝晩の冷え込みが予想されます。重ね着できる服装を準備しましょう。
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
