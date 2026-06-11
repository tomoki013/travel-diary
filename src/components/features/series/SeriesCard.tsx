import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
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
    <Reveal className="bg-card border-border flex flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Thumbnail Section */}
      <Link
        href={`/series/${series.slug}`}
        className="group relative block aspect-[16/9] overflow-hidden"
      >
        <Image
          src={series.imageUrl}
          alt={series.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {IconComponent && (
          <div className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm">
            <IconComponent size={20} />
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="flex flex-grow flex-col p-6">
        <Link href={`/series/${series.slug}`} className="group mb-3 block">
          <h2 className="text-foreground group-hover:text-primary text-2xl font-bold transition-colors">
            {series.title}
          </h2>
        </Link>
        <p className="text-muted-foreground mb-6 flex-grow text-sm">{series.description}</p>

        {/* Status Block */}
        <div className="bg-muted/50 mb-4 flex items-center gap-2 rounded-lg p-3 text-sm">
          <BookText size={16} className="text-primary" />
          <span className="text-foreground font-medium">収録記事数</span>
          <div className="border-border mx-2 flex-grow border-b border-dashed"></div>
          <span className="text-primary text-lg font-bold">{postsLength}</span>
        </div>

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <div className="border-border mt-auto mb-4 border-t pt-4">
            <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              最新の記事
            </h3>
            <ul className="space-y-2">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/posts/${post.slug}`} className="group/link flex items-center">
                    <ChevronRight
                      size={14}
                      className="text-muted-foreground group-hover/link:text-primary mr-1 shrink-0 transition-colors"
                    />
                    <span className="text-foreground group-hover/link:text-primary line-clamp-1 text-sm transition-colors">
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
          className={`text-primary bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/40 flex w-full items-center justify-center rounded-lg border py-2.5 text-sm font-medium transition-all duration-300 ${recentPosts.length === 0 ? "mt-auto" : ""}`}
        >
          シリーズの詳細を見る
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </Reveal>
  );
};

export default SeriesCard;
