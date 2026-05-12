"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Clock, Heart } from "lucide-react";

interface PhotoSpot {
  name: string;
  theme: string;
  bestTime: string;
  instagrammability: number;
}

interface PhotoOppsComparisonProps {
  destination: string;
  spots: PhotoSpot[];
}

export const PhotoOppsComparison: React.FC<PhotoOppsComparisonProps> = ({ destination, spots }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-4 w-full max-w-2xl"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="h-5 w-5" />
            {destination} のおすすめフォトスポット
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {spots.map((spot, idx) => (
              <div
                key={idx}
                className="group from-card to-accent/5 relative overflow-hidden rounded-xl border bg-gradient-to-br p-4"
              >
                <div className="relative z-10 space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-semibold">
                      {spot.theme}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Heart
                          key={i}
                          className={`h-3 w-3 ${i < spot.instagrammability ? "fill-red-400 text-red-400" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-sm leading-tight font-bold">{spot.name}</h4>
                  <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                    <Clock className="h-3 w-3" />
                    狙い目: {spot.bestTime}
                  </div>
                </div>
                {/* Decorative background circle */}
                <div className="bg-primary/5 absolute -right-4 -bottom-4 h-16 w-16 rounded-full transition-transform group-hover:scale-150" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
