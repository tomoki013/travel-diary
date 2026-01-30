"use client";

import { motion } from "framer-motion";
import { JOURNEY_DATA, JourneyItem } from "@/data/journey";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Tag } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

const JourneyCard = ({ item, index }: { item: JourneyItem; index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        "relative flex flex-col md:flex-row gap-8 items-center w-full max-w-5xl mx-auto mb-24 last:mb-0",
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Date Marker (Center) */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 md:top-8 z-20 flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg" />
        <div className="mt-2 text-sm font-bold text-muted-foreground bg-background px-2 py-1 rounded border border-border/50 shadow-sm whitespace-nowrap">
          {item.date}
        </div>
      </div>

      {/* Content Side */}
      <div
        className={cn(
          "w-full md:w-1/2 pl-12 md:pl-0",
          isEven ? "md:pr-16" : "md:pl-16"
        )}
      >
        <Link href={`/journey/${item.id}`} className="block">
          <div className="relative group overflow-hidden rounded-2xl bg-card border border-border shadow-md hover:shadow-xl transition-all duration-300">
            {/* Image Placeholder or Actual Image */}
            <div className="relative h-48 md:h-64 w-full bg-muted overflow-hidden">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-secondary">
                  <MapPin className="w-12 h-12 opacity-50" />
                </div>
              )}

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Title on Image */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl md:text-2xl font-bold font-heading leading-tight mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>

            {/* Description Body */}
            <div className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {item.description}
              </p>

              {item.tags && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Empty Side for Balance */}
      <div className="hidden md:block w-1/2" />
    </motion.div>
  );
};

const JourneyTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative py-20 px-4 md:px-8 overflow-hidden"
    >
      {/* Central Line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent md:-translate-x-1/2">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent w-[2px] -ml-[0.5px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {JOURNEY_DATA.map((item, index) => (
          <JourneyCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* Bottom Decoration */}
      <div className="relative mt-20 text-center">
        <div className="inline-flex flex-col items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary/50 animate-pulse" />
          <p className="text-muted-foreground text-sm tracking-widest uppercase">
            To be continued...
          </p>
        </div>
      </div>
    </div>
  );
};

export default JourneyTimeline;
