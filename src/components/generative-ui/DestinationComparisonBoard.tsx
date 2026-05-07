"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface Category {
  name: string;
  ratingA: number;
  ratingB: number;
  comment: string;
}

interface DestinationComparisonBoardProps {
  destinationA: string;
  destinationB: string;
  categories: Category[];
  verdict: string;
}

export const DestinationComparisonBoard: React.FC<DestinationComparisonBoardProps> = ({
  destinationA,
  destinationB,
  categories,
  verdict,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl space-y-4 my-4"
    >
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex justify-between items-center">
            <span>{destinationA} <span className="text-muted-foreground text-sm font-normal mx-2">vs</span> {destinationB}</span>
            <Badge variant="outline">比較ボード</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-7 text-xs font-medium text-muted-foreground mb-2">
              <div className="col-span-2 text-left">{destinationA}</div>
              <div className="col-span-3 text-center">カテゴリ</div>
              <div className="col-span-2 text-right">{destinationB}</div>
            </div>

            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="grid grid-cols-7 items-center gap-2">
                  <div className="col-span-2 flex justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < cat.ratingA ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <div className="col-span-3 text-center text-sm font-bold bg-muted/50 py-1 rounded">
                    {cat.name}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < cat.ratingB ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground italic px-4">
                  {cat.comment}
                </p>
              </div>
            ))}

            <div className="pt-4 border-t border-dashed">
              <h4 className="text-sm font-bold mb-1">結論</h4>
              <p className="text-sm bg-primary/5 p-3 rounded-lg border border-primary/10">
                {verdict}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
