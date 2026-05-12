"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, Bus, Car, Info, AlertTriangle } from "lucide-react";

interface TransportOption {
  mode: string;
  time: string;
  cost: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
}

interface AirportAnxietyMapProps {
  airportName: string;
  destinationName: string;
  options: TransportOption[];
  overallAnxietyLevel: number;
}

const ModeIcon = ({ mode }: { mode: string }) => {
  const m = mode.toLowerCase();
  if (m.includes("train") || m.includes("rail")) return <Train className="h-4 w-4" />;
  if (m.includes("bus")) return <Bus className="h-4 w-4" />;
  if (m.includes("taxi") || m.includes("uber") || m.includes("car"))
    return <Car className="h-4 w-4" />;
  return <Info className="h-4 w-4" />;
};

const DifficultyBadge = ({ level }: { level: string }) => {
  switch (level) {
    case "Easy":
      return <Badge className="bg-green-500 hover:bg-green-600">かんたん</Badge>;
    case "Medium":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">ふつう</Badge>;
    case "Hard":
      return <Badge className="bg-red-500 hover:bg-red-600">注意が必要</Badge>;
    default:
      return <Badge variant="secondary">{level}</Badge>;
  }
};

export const AirportAnxietyMap: React.FC<AirportAnxietyMapProps> = ({
  airportName,
  destinationName,
  options,
  overallAnxietyLevel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="my-4 w-full max-w-2xl"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>
              {airportName} ➔ {destinationName} への移動
            </span>
            <AlertTriangle
              className={`h-5 w-5 ${overallAnxietyLevel > 70 ? "text-red-500" : "text-yellow-500"}`}
            />
          </CardTitle>
          <div className="text-muted-foreground text-xs">不安度レベル: {overallAnxietyLevel}%</div>
          <div className="bg-muted mt-1 h-1.5 w-full rounded-full">
            <div
              className={`h-1.5 rounded-full ${overallAnxietyLevel > 70 ? "bg-red-500" : "bg-yellow-500"}`}
              style={{ width: `${overallAnxietyLevel}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {options.map((opt, idx) => (
              <div
                key={idx}
                className="bg-card hover:bg-accent/5 flex gap-4 rounded-lg border p-3 transition-colors"
              >
                <div className="bg-primary/10 h-fit flex-shrink-0 rounded-full p-2">
                  <ModeIcon mode={opt.mode} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{opt.mode}</span>
                    <DifficultyBadge level={opt.difficulty} />
                  </div>
                  <div className="text-muted-foreground flex gap-3 text-xs">
                    <span>⏳ {opt.time}</span>
                    <span>💰 {opt.cost}</span>
                  </div>
                  <p className="text-xs">{opt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
