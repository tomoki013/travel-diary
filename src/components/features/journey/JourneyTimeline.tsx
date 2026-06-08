import { Reveal } from "@/components/common/Reveal";
import { JOURNEY_DATA, JourneyItem } from "@/data/journey";
import { cn } from "@/lib/utils";
import { MapPin, Tag } from "lucide-react";
import Link from "next/link";

const JourneyCard = ({ item, index }: { item: JourneyItem; index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <Reveal
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1 } },
      }}
      className={cn(
        "relative mx-auto mb-24 flex w-full max-w-5xl flex-col items-center gap-8 last:mb-0 md:flex-row",
        isEven ? "md:flex-row" : "md:flex-row-reverse",
      )}
    >
      {/* Date Marker (Center) */}
      <div className="absolute top-0 left-4 z-20 flex flex-col items-center md:top-8 md:left-1/2 md:-translate-x-1/2">
        <div className="bg-primary border-background h-4 w-4 rounded-full border-4 shadow-lg" />
        <div className="text-muted-foreground bg-background border-border/50 mt-2 rounded border px-2 py-1 text-sm font-bold whitespace-nowrap shadow-sm">
          {item.date}
        </div>
      </div>

      {/* Content Side */}
      <div className={cn("w-full pl-12 md:w-1/2 md:pl-0", isEven ? "md:pr-16" : "md:pl-16")}>
        <Link href={`/journey/${item.id}`} className="block">
          <div className="group bg-card border-border relative overflow-hidden rounded-2xl border shadow-md transition-all duration-300 hover:shadow-xl">
            {/* Image Placeholder or Actual Image */}
            <div className="bg-muted relative h-48 w-full overflow-hidden md:h-64">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="bg-secondary/10 text-secondary flex h-full w-full items-center justify-center">
                  <MapPin className="h-12 w-12 opacity-50" />
                </div>
              )}

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Title on Image */}
              <div className="absolute right-4 bottom-4 left-4 text-white">
                <h3 className="font-heading mb-1 text-xl leading-tight font-bold md:text-2xl">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <MapPin className="h-3 w-3" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>

            {/* Description Body */}
            <div className="space-y-4 p-6">
              <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                {item.description}
              </p>

              {item.tags && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-secondary/10 text-secondary inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                    >
                      <Tag className="h-3 w-3" />
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
      <div className="hidden w-1/2 md:block" />
    </Reveal>
  );
};

const JourneyTimeline = () => {
  return (
    <div className="relative overflow-hidden px-4 py-20 md:px-8">
      {/* Central Line */}
      <div className="via-border absolute top-0 bottom-0 left-6 w-px bg-gradient-to-b from-transparent to-transparent md:left-1/2 md:-translate-x-1/2">
        <div className="via-primary/20 absolute inset-0 -ml-[0.5px] w-[2px] bg-gradient-to-b from-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {JOURNEY_DATA.map((item, index) => (
          <JourneyCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* Bottom Decoration */}
      <div className="relative mt-20 text-center">
        <div className="inline-flex flex-col items-center gap-3">
          <div className="bg-primary/50 h-3 w-3 animate-pulse rounded-full" />
          <p className="text-muted-foreground text-sm tracking-widest uppercase">
            To be continued...
          </p>
        </div>
      </div>
    </div>
  );
};

export default JourneyTimeline;
