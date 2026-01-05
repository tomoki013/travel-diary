"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Plane } from "lucide-react";

const JourneyTeaser = () => {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 shadow-xl"
        >
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
            <div className="space-y-4 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
                <Plane className="w-3 h-3 rotate-[-45deg]" />
                <span>My Footsteps</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-heading font-bold text-white">
                これまでの旅の軌跡
              </h3>

              <p className="text-blue-100/80 leading-relaxed max-w-lg">
                訪れた国々、忘れられない景色、そして旅の思い出。
                私のこれまでの冒険をタイムラインで振り返ります。
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link
                href="/journey"
                className="group inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-50 transition-colors"
              >
                <span>軌跡を辿る</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JourneyTeaser;
