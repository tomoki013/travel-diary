"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, CalendarDays } from "lucide-react";

interface ScheduleItem {
  time: string;
  activity: string;
  description: string;
  location?: string;
}

interface DayPlan {
  day: number;
  title: string;
  schedule: ScheduleItem[];
}

interface ItineraryDisplayProps {
  title: string;
  destination: string;
  duration: string;
  days: DayPlan[];
}

export const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  title,
  destination,
  duration,
  days,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl my-6"
    >
      <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-card to-accent/5">
        <CardHeader className="bg-primary/5 border-b border-primary/10 pb-6">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
              <CalendarDays className="w-3 h-3 mr-1" />
              {duration} プラン
            </Badge>
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">{title}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground mt-1 font-medium">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            {destination}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {days.map((day) => (
              <div key={day.day} className="p-6 space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-black">
                    {day.day}
                  </span>
                  {day.title}
                </h3>
                <div className="space-y-6 ml-4 border-l-2 border-primary/10 pl-6 py-2">
                  {day.schedule.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[33px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-background group-hover:scale-125 transition-transform" />
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-primary/60">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.time}
                        </div>
                        <h4 className="font-bold text-sm text-foreground leading-snug">{item.activity}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                          {item.description}
                        </p>
                        {item.location && (
                          <div className="text-[10px] flex items-center text-muted-foreground/70 italic mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {item.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
