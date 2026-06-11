"use client";

import Link from "next/link";
import { m } from "framer-motion";
import RoadmapHero from "@/components/features/roadmap/RoadmapHero";
import RoadmapTimeline from "@/components/features/roadmap/RoadmapTimeline";
import UpdateList from "@/components/features/roadmap/UpdateList";

export default function RoadmapPage() {
  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <RoadmapHero />

      <section className="py-8 text-center">
        <h2 className="font-heading text-primary text-3xl font-bold">Future Roadmap</h2>
        <p className="text-muted-foreground mt-2">これからの冒険の計画</p>
      </section>

      <RoadmapTimeline />

      <UpdateList />

      {/* Footer Message */}
      <section className="space-y-8 py-20 text-center">
        <div>
          <h2 className="font-heading text-primary mb-4 text-2xl font-bold">To Be Continued...</h2>
          <p className="text-muted-foreground">旅はまだ始まったばかり。</p>
        </div>

        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-full px-8 py-3 font-bold shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            新しい旅を始める
          </Link>
        </m.div>
      </section>
    </main>
  );
}
