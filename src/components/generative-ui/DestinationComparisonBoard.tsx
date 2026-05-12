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
      className="my-4 w-full max-w-2xl space-y-4"
    >
      <Card className="border-primary/20 border-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-xl">
            <span>
              {destinationA}{" "}
              <span className="text-muted-foreground mx-2 text-sm font-normal">vs</span>{" "}
              {destinationB}
            </span>
            <Badge variant="outline">比較ボード</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-muted-foreground mb-2 grid grid-cols-7 text-xs font-medium">
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
                        className={`h-3 w-3 ${i < cat.ratingA ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <div className="bg-muted/50 col-span-3 rounded py-1 text-center text-sm font-bold">
                    {cat.name}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < cat.ratingB ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground px-4 text-center text-xs italic">
                  {cat.comment}
                </p>
              </div>
            ))}

            <div className="border-t border-dashed pt-4">
              <h4 className="mb-1 text-sm font-bold">結論</h4>
              <p className="bg-primary/5 border-primary/10 rounded-lg border p-3 text-sm">
                {verdict}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
