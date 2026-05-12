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
      className="my-6 w-full max-w-3xl"
    >
      <Card className="from-card to-accent/5 overflow-hidden border-none bg-gradient-to-br shadow-2xl">
        <CardHeader className="bg-primary/5 border-primary/10 border-b pb-6">
          <div className="mb-2 flex items-start justify-between">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 border-none"
            >
              <CalendarDays className="mr-1 h-3 w-3" />
              {duration} プラン
            </Badge>
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">{title}</CardTitle>
          <div className="text-muted-foreground mt-1 flex items-center text-sm font-medium">
            <MapPin className="text-primary mr-1 h-4 w-4" />
            {destination}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-border/40 divide-y">
            {days.map((day) => (
              <div key={day.day} className="space-y-4 p-6">
                <h3 className="flex items-center gap-3 text-lg font-bold">
                  <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-black">
                    {day.day}
                  </span>
                  {day.title}
                </h3>
                <div className="border-primary/10 ml-4 space-y-6 border-l-2 py-2 pl-6">
                  {day.schedule.map((item, idx) => (
                    <div key={idx} className="group relative">
                      <div className="bg-primary ring-background absolute top-1.5 -left-[33px] h-3 w-3 rounded-full ring-4 transition-transform group-hover:scale-125" />
                      <div className="flex flex-col space-y-1">
                        <div className="text-primary/60 flex items-center text-[10px] font-black tracking-widest uppercase">
                          <Clock className="mr-1 h-3 w-3" />
                          {item.time}
                        </div>
                        <h4 className="text-foreground text-sm leading-snug font-bold">
                          {item.activity}
                        </h4>
                        <p className="text-muted-foreground max-w-md text-xs leading-relaxed">
                          {item.description}
                        </p>
                        {item.location && (
                          <div className="text-muted-foreground/70 mt-1 flex items-center text-[10px] italic">
                            <MapPin className="mr-1 h-3 w-3" />
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
