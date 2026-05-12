"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Briefcase, ThermometerSnowflake } from "lucide-react";

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

export const PackingList: React.FC<PackingListProps> = ({ destination, season, items }) => {
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-4 w-full max-w-2xl"
    >
      <Card className="border-2 border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="text-primary h-5 w-5" />
            {destination} ({season}) 持ち物チェックリスト
          </CardTitle>
          <p className="text-muted-foreground text-xs">
            現地のアドバイスに基づいたおすすめのパッキング
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat} className="space-y-3">
                <h4 className="bg-muted w-fit rounded px-2 py-0.5 text-xs font-black tracking-tighter uppercase">
                  {cat}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {items
                    .filter((i) => i.category === cat)
                    .map((i, idx) => (
                      <div
                        key={idx}
                        className="hover:bg-muted/30 flex items-start space-x-3 rounded-lg p-2 transition-colors"
                      >
                        <Checkbox id={`${cat}-${idx}`} className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={`${cat}-${idx}`}
                            className="flex items-center gap-2 text-sm leading-none font-bold peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {i.item}
                            {i.essential && (
                              <span className="rounded bg-red-100 px-1 text-[9px] font-black text-red-600">
                                MUST
                              </span>
                            )}
                          </Label>
                          <p className="text-muted-foreground text-xs italic">{i.reason}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
            <div className="rounded-full bg-white p-2 shadow-sm">
              <ThermometerSnowflake className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-[10px] leading-tight text-blue-700">
              <strong>アドバイス:</strong> {season}の{destination}
              は朝晩の冷え込みが予想されます。重ね着できる服装を準備しましょう。
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
