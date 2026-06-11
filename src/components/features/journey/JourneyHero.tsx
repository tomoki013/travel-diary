import { Plane } from "lucide-react";

// 旧 framer-motion のマウント時フェードイン(y:20 / 0.8s easeOut、
// スクロールインジケータは 1s 遅延フェード)を CSS animation で同一再現。
const JourneyHero = () => {
  return (
    <section className="relative flex h-[60vh] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 md:h-[70vh]">
      {/* Background with abstract map or texture */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-30" />
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-amber-600 opacity-20 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-orange-500 opacity-20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div
          className="animate-fade-up-mount space-y-6"
          style={{ animationTimingFunction: "ease-out" }}
        >
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-amber-100/10 p-3 backdrop-blur-sm">
            <Plane className="h-6 w-6 rotate-[-45deg] text-amber-200" />
          </div>

          <h1 className="font-heading text-4xl font-bold tracking-tight text-amber-50 md:text-6xl lg:text-7xl">
            Journey History
          </h1>

          <p className="mx-auto max-w-2xl font-sans text-lg leading-relaxed font-light text-stone-300 md:text-xl">
            旅の記憶、足跡の記録。
            <br />
            訪れた場所、出会った風景、そして心に残った瞬間のアーカイブ。
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="animate-fade-in-mount absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ animationDuration: "1s", animationDelay: "1s" }}
      >
        <span className="text-xs tracking-widest text-amber-200/50 uppercase">
          Scroll to explore
        </span>
        <div className="h-12 w-[1px] bg-gradient-to-b from-amber-200/50 to-transparent" />
      </div>
    </section>
  );
};

export default JourneyHero;
