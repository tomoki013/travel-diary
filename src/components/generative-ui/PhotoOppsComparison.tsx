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

export const PhotoOppsComparison: React.FC<PhotoOppsComparisonProps> = ({
  destination,
  spots,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl my-4"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {destination} のおすすめフォトスポット
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {spots.map((spot, idx) => (
              <div key={idx} className="relative group p-4 border rounded-xl bg-gradient-to-br from-card to-accent/5 overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {spot.theme}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Heart 
                          key={i} 
                          className={`w-3 h-3 ${i < spot.instagrammability ? "fill-red-400 text-red-400" : "text-muted"}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm leading-tight">{spot.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    狙い目: {spot.bestTime}
                  </div>
                </div>
                {/* Decorative background circle */}
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-150 transition-transform" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
