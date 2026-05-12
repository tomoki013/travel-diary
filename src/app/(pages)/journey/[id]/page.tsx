import { notFound } from "next/navigation";
import { JOURNEY_DATA, getJourneyById } from "@/data/journey";
import { getAllPosts } from "@/lib/post-metadata";
import PostCard from "@/components/common/PostCard";
import Image from "next/image";
import { MapPin } from "lucide-react";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return JOURNEY_DATA.map((journey) => ({
    id: journey.id,
  }));
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

  const posts = (await getAllPosts({ journey: journey.id }))
    .filter((post) => post.category === "series" && post.series === "travel-diary")
    .sort(
      (left, right) =>
        new Date(left.dates[0] || "1970-01-01").getTime() -
        new Date(right.dates[0] || "1970-01-01").getTime(),
    );

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden bg-slate-900 md:h-[50vh]">
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
        <div className="from-background absolute inset-0 bg-gradient-to-t to-transparent" />

        <div className="absolute right-0 bottom-0 left-0 container mx-auto p-8 md:p-16">
          <div className="max-w-4xl">
            <div className="bg-primary/20 text-primary border-primary/20 mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold shadow-sm backdrop-blur-md">
              <span className="bg-primary h-2 w-2 rounded-full" />
              {journey.date}
            </div>
            <h1 className="text-foreground font-heading mb-4 text-3xl leading-tight font-bold drop-shadow-sm md:text-5xl lg:text-6xl">
              {journey.title}
            </h1>
            <div className="text-muted-foreground mb-6 flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" />
              {journey.location}
            </div>
            <p className="text-muted-foreground/90 max-w-2xl text-lg leading-relaxed md:text-xl">
              {journey.description}
            </p>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="mb-12 flex items-center gap-3 text-2xl font-bold md:text-3xl">
          <span className="bg-primary h-8 w-1.5 rounded-full" />
          旅のブログ
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            ({posts.length}記事)
          </span>
        </h2>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-card/50 border-border/50 rounded-3xl border py-20 text-center backdrop-blur-sm">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <MapPin className="text-muted-foreground h-8 w-8 opacity-50" />
            </div>
            <p className="text-muted-foreground font-medium">
              この旅に関連するブログ記事はまだありません。
            </p>
            <p className="text-muted-foreground/60 mt-2 text-sm">
              記事が追加されるのをお待ちください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
