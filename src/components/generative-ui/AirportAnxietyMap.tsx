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
  if (m.includes("train") || m.includes("rail")) return <Train className="w-4 h-4" />;
  if (m.includes("bus")) return <Bus className="w-4 h-4" />;
  if (m.includes("taxi") || m.includes("uber") || m.includes("car")) return <Car className="w-4 h-4" />;
  return <Info className="w-4 h-4" />;
};

const DifficultyBadge = ({ level }: { level: string }) => {
  switch (level) {
    case "Easy": return <Badge className="bg-green-500 hover:bg-green-600">かんたん</Badge>;
    case "Medium": return <Badge className="bg-yellow-500 hover:bg-yellow-600">ふつう</Badge>;
    case "Hard": return <Badge className="bg-red-500 hover:bg-red-600">注意が必要</Badge>;
    default: return <Badge variant="secondary">{level}</Badge>;
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
      className="w-full max-w-2xl my-4"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>{airportName} ➔ {destinationName} への移動</span>
            <AlertTriangle className={`w-5 h-5 ${overallAnxietyLevel > 70 ? "text-red-500" : "text-yellow-500"}`} />
          </CardTitle>
          <div className="text-xs text-muted-foreground">不安度レベル: {overallAnxietyLevel}%</div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full ${overallAnxietyLevel > 70 ? "bg-red-500" : "bg-yellow-500"}`}
              style={{ width: `${overallAnxietyLevel}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {options.map((opt, idx) => (
              <div key={idx} className="flex gap-4 p-3 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full h-fit">
                  <ModeIcon mode={opt.mode} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{opt.mode}</span>
                    <DifficultyBadge level={opt.difficulty} />
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
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
