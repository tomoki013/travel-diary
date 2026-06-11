import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
import { members } from "@/data/member";

const HomeAboutSection = () => {
  const author = members[0];

  if (!author) {
    return null;
  }

  return (
    <Reveal as="section" className="mx-auto max-w-4xl px-6 py-20 md:px-8">
      <div className="border-border/60 bg-card/60 rounded-3xl border p-8 shadow-sm backdrop-blur-sm md:p-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          {/* flex で片方の辺だけ縮むと next/image がアスペクト比警告を出すため
              両辺を固定し shrink-0 を付ける */}
          <Image
            src={author.image}
            alt={author.name}
            width={112}
            height={112}
            className="h-28 w-28 shrink-0 rounded-full object-cover"
          />
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm font-semibold tracking-[0.24em]">
              ABOUT THIS BLOG
            </p>
            <h2 className="text-foreground mt-2 text-3xl font-bold">ともきちの旅行日記について</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {author.description}
              旅先での空気感だけでなく、移動や予約でつまずきやすかった点まで、
              次に行く人が読みやすい形に整理して残しています。
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                href="/about"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition"
              >
                プロフィールを見る
              </Link>
              <Link
                href="/journey"
                className="border-border text-foreground hover:bg-muted inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-semibold transition"
              >
                旅の軌跡を見る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default HomeAboutSection;
