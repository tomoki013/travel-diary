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
    <Link href={`/series/${series.slug}`} className="block group">
      <div className="relative overflow-hidden rounded-2xl aspect-square mb-6 shadow-sm">
        <div className="w-full h-full relative">
          <div className="w-full h-full relative">
            <Image
              src={series.imageUrl}
              alt={series.title}
              fill
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-0 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {series.title}
      </h3>
      <p className="text-muted-foreground text-sm">{series.description}</p>
    </Link>
  );
};

export default SeriesCard;
