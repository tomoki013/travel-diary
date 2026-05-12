"use client";

import Link from "next/link";
import Image from "next/image";
import { Series } from "@/types/types";
import { ArrowRight } from "lucide-react";

interface SeriesCardProps {
  series: Series;
}

const SeriesCard = ({ series }: SeriesCardProps) => {
  return (
    <Link href={`/series/${series.slug}`} className="group block">
      <div className="relative mb-6 aspect-square overflow-hidden rounded-2xl shadow-sm">
        <div className="relative h-full w-full">
          <div className="relative h-full w-full">
            <Image
              src={series.imageUrl}
              alt={series.title}
              fill
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="mb-0 flex h-10 w-10 translate-y-4 transform items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
      <h3 className="text-foreground group-hover:text-primary mb-2 text-2xl font-bold transition-colors">
        {series.title}
      </h3>
      <p className="text-muted-foreground text-sm">{series.description}</p>
    </Link>
  );
};

export default SeriesCard;
