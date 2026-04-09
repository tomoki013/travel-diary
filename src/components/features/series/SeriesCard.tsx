"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { sectionVariants } from "@/components/common/animation";
import {
  Castle,
  Sunset,
  Landmark,
  Globe2,
  MountainSnow,
  type LucideProps,
  BookText,
  ChevronRight,
} from "lucide-react";
import { Series, Post } from "@/types/types";

type PostMetadata = Omit<Post, "content">;

// Icon map
const iconMap: { [key: string]: React.FC<LucideProps> } = {
  Castle,
  Sunset,
  Landmark,
  Globe2,
  MountainSnow,
};

interface SeriesCardProps {
  series: Series;
  postsLength: number;
  recentPosts?: PostMetadata[];
}

const SeriesCard = ({ series, postsLength, recentPosts = [] }: SeriesCardProps) => {
  const IconComponent = iconMap[series.IconComponent];
  return (
    <motion.div
      variants={sectionVariants}
      className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-border flex flex-col"
    >
      {/* Thumbnail Section */}
      <Link href={`/series/${series.slug}`} className="block relative aspect-[16/9] overflow-hidden group">
        <Image
          src={series.imageUrl}
          alt={series.title}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {IconComponent && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white">
            <IconComponent size={20} />
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/series/${series.slug}`} className="group mb-3 block">
          <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
            {series.title}
          </h2>
        </Link>
        <p className="text-muted-foreground text-sm mb-6 flex-grow">
          {series.description}
        </p>

        {/* Status Block */}
        <div className="flex items-center gap-2 text-sm mb-4 bg-muted/50 rounded-lg p-3">
          <BookText size={16} className="text-primary" />
          <span className="font-medium text-foreground">収録記事数</span>
          <div className="flex-grow border-b border-dashed border-border mx-2"></div>
          <span className="font-bold text-lg text-primary">{postsLength}</span>
        </div>

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <div className="border-t border-border pt-4 mt-auto mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">最新の記事</h3>
            <ul className="space-y-2">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="flex items-center group/link"
                  >
                    <ChevronRight size={14} className="text-muted-foreground group-hover/link:text-primary transition-colors shrink-0 mr-1" />
                    <span className="text-sm text-foreground group-hover/link:text-primary transition-colors line-clamp-1">
                      {post.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Series Detail Link */}
        <Link
          href={`/series/${series.slug}`}
          className={`w-full py-2.5 flex items-center justify-center text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-lg transition-all duration-300 ${recentPosts.length === 0 ? 'mt-auto' : ''}`}
        >
          シリーズの詳細を見る
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default SeriesCard;
