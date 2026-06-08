import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealStagger } from "@/components/common/Reveal";
import { Region, Post, AllDestinationProps } from "@/types/types";
type PostMetadata = Omit<Post, "content">;
import PostCard from "@/components/common/PostCard";
import { slideFadeIn } from "@/components/common/animation";
import { Wind } from "lucide-react";
import AllDestination from "@/components/features/destination/allDestination";
import GlobePromo from "@/components/features/promo/GlobePromo";

interface ClientProps extends AllDestinationProps {
  region: Region;
  seriesPosts: PostMetadata[];
  tourismPosts: PostMetadata[];
  itineraryPosts: PostMetadata[];
  oneOffPosts: PostMetadata[];
}

const Client = ({
  region,
  seriesPosts,
  tourismPosts,
  itineraryPosts,
  oneOffPosts,
  regionData,
}: ClientProps) => {
  const noPosts =
    seriesPosts.length === 0 &&
    tourismPosts.length === 0 &&
    itineraryPosts.length === 0 &&
    oneOffPosts.length === 0;

  const country = regionData
    .flatMap((continent) => continent.countries)
    .find((c) => c.slug === region.slug);

  const hasChildren = country && country.children && country.children.length > 0;

  return (
    <div>
      {/* ==================== Hero Section ==================== */}
      <section className="relative flex h-80 items-center justify-center text-center text-white/80 md:h-96">
        <Image
          src={region.imageURL}
          alt={region.name}
          fill
          className="object-cover brightness-50"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl font-bold tracking-tight uppercase md:text-6xl">
            {region.slug} - {region.name}
          </h1>
        </div>
      </section>

      {/* ==================== Child Regions Section ==================== */}
      {hasChildren && country?.children && (
        <Reveal as="section" className="bg-background">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold">この国のエリア</h2>
            <RevealStagger
              className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-4"
              staggerChildren={0.1}
              delayChildren={0.1}
            >
              {country.children.map((child) => (
                <Reveal key={child.slug}>
                  <Link href={`/destination/${child.slug}`} className="group block">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={child.imageURL}
                        alt={child.name}
                        fill
                        className="transform object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
                      />
                      <div className="absolute inset-0 transition-colors duration-300" />
                    </div>
                    <h3 className="text-foreground group-hover:text-primary mt-4 text-center text-lg font-semibold transition-colors duration-300">
                      {child.name}
                    </h3>
                  </Link>
                </Reveal>
              ))}
            </RevealStagger>
          </div>
        </Reveal>
      )}

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {noPosts ? (
          <Reveal
            variants={slideFadeIn()}
            className="bg-background rounded-xl border-2 border-dashed border-slate-300 p-8 text-center md:p-12"
          >
            <div className="mb-4 flex justify-center">
              <Wind className="h-16 w-16 text-slate-400" strokeWidth={1} />
            </div>
            <h3 className="text-foreground text-2xl font-bold">まだ何もない場所</h3>
            <p className="text-foreground mx-auto mt-2 max-w-md">
              この地域に関する記事は現在準備中です。
              <br />
              新しい冒険の記録が追加されるのをお楽しみに！
            </p>
          </Reveal>
        ) : (
          <div className="space-y-16">
            {/* ==================== イントロダクション ==================== */}
            <Reveal as="section">
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <p className="text-foreground text-xl font-medium md:text-2xl">
                  {region.name}の旅行ガイド・記
                </p>
                {region.description ? (
                  <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">
                    {region.description}
                  </p>
                ) : (
                  <p className="text-foreground text-lg leading-relaxed">
                    {region.name}
                    の旅で役立つ情報や、旅の記録をまとめました。あなたの次の冒険の参考にしてください。
                  </p>
                )}
              </div>
            </Reveal>

            {/* ==================== 関連シリーズセクション ==================== */}
            {seriesPosts.length > 0 && (
              <Reveal as="section">
                <h2 className="mb-8 text-center text-3xl font-bold">
                  この地域が登場するシリーズ記事
                </h2>
                <RevealStagger className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {seriesPosts.map((post, index) => (
                    <Reveal key={post.slug}>
                      <PostCard
                        post={post}
                        isReversed={index % 2 !== 0}
                        showMetadata
                        variant="relate"
                      />
                    </Reveal>
                  ))}
                </RevealStagger>
              </Reveal>
            )}

            {/* ==================== 観光情報セクション ==================== */}
            {tourismPosts.length > 0 && (
              <Reveal as="section" amount={0.2}>
                <h2 className="mb-8 text-center text-3xl font-bold">
                  観光情報 - Tourist Information
                </h2>
                <RevealStagger className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {tourismPosts.map((post, index) => (
                    <Reveal key={post.slug}>
                      <PostCard
                        post={post}
                        isReversed={index % 2 !== 0}
                        showMetadata
                        variant="relate"
                      />
                    </Reveal>
                  ))}
                </RevealStagger>
              </Reveal>
            )}

            {/* ==================== 旅程&費用セクション ==================== */}
            {itineraryPosts.length > 0 && (
              <Reveal as="section">
                <h2 className="mb-8 text-center text-3xl font-bold">
                  旅程&費用 - Itinerary & Cost
                </h2>
                <RevealStagger className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {itineraryPosts.map((post, index) => (
                    <Reveal key={post.slug}>
                      <PostCard
                        post={post}
                        isReversed={index % 2 !== 0}
                        showMetadata
                        variant="relate"
                      />
                    </Reveal>
                  ))}
                </RevealStagger>
              </Reveal>
            )}

            {/* ==================== 単発企画セクション ==================== */}
            {oneOffPosts.length > 0 && (
              <Reveal as="section">
                <h2 className="mb-8 text-center text-3xl font-bold">単発企画 - one-off project</h2>
                <RevealStagger className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {oneOffPosts.map((post, index) => (
                    <Reveal key={post.slug}>
                      <PostCard
                        post={post}
                        isReversed={index % 2 !== 0}
                        showMetadata
                        variant="relate"
                      />
                    </Reveal>
                  ))}
                </RevealStagger>
              </Reveal>
            )}
          </div>
        )}
      </div>
      <GlobePromo
        className="mx-auto max-w-5xl"
        queryParams={country ? { country: region.slug } : { region: region.slug }}
      />

      <div className="mx-auto mt-16 max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold">全ての旅行先を見る</h2>
        <AllDestination
          regionData={regionData}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"
          countryStyle="border-b-2 border-secondary"
        />
      </div>
    </div>
  );
};

export default Client;
