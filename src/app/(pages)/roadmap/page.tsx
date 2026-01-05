"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import RoadmapHero from "@/components/features/roadmap/RoadmapHero";
import RoadmapTimeline from "@/components/features/roadmap/RoadmapTimeline";
import UpdateList from "@/components/features/roadmap/UpdateList";

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <RoadmapHero />
      <UpdateList />

      <section className="py-8 text-center">
        <h2 className="text-3xl font-heading font-bold text-primary">
            Future Roadmap
        </h2>
        <p className="mt-2 text-muted-foreground">これからの冒険の計画</p>
      </section>

      <RoadmapTimeline />

      {/* Footer Message */}
      <section className="py-20 text-center space-y-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary mb-4">
            To Be Continued...
          </h2>
          <p className="text-muted-foreground">旅はまだ始まったばかり。</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300"
          >
            新しい旅を始める
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
