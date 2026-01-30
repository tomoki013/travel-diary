import { notFound } from "next/navigation";
import { getJourneyById } from "@/data/journey";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/common/PostCard";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const journey = getJourneyById(id);

  if (!journey) {
    return {
      title: "Journey Not Found | ともきちの旅行日記",
    };
  }

  return {
    title: `${journey.title} - 旅の記録 | ともきちの旅行日記`,
    description: journey.description,
  };
}

export default async function JourneyDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const journey = getJourneyById(id);

  if (!journey) {
    notFound();
  }

  const posts = await getAllPosts({ journey: journey.id });

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-slate-900 overflow-hidden">
        {journey.image ? (
          <Image
            src={journey.image}
            alt={journey.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 container mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary text-sm font-bold mb-4 border border-primary/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {journey.date}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 font-heading leading-tight drop-shadow-sm">
              {journey.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground text-lg mb-6">
              <MapPin className="w-5 h-5" />
              {journey.location}
            </div>
            <p className="text-lg md:text-xl text-muted-foreground/90 max-w-2xl leading-relaxed">
              {journey.description}
            </p>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-primary rounded-full" />
          旅のブログ
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({posts.length}記事)
          </span>
        </h2>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card/50 rounded-3xl border border-border/50 backdrop-blur-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <p className="text-muted-foreground font-medium">
              この旅に関連するブログ記事はまだありません。
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              記事が追加されるのをお待ちください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
