"use client";

import { motion } from "framer-motion";
import { Globe, Map as MapIcon, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GlobePromoProps {
  className?: string;
  queryParams?: {
    country?: string;
    region?: string;
    spot?: string;
    trip?: string;
  };
}

const GlobePromo = ({ className, queryParams }: GlobePromoProps) => {
  const getMapUrl = () => {
    const baseUrl = "https://travel.tomokichidiary.com/map/";
    if (!queryParams) return baseUrl;

    const params = new URLSearchParams();
    if (queryParams.country) params.append("country", queryParams.country);
    if (queryParams.region) params.append("region", queryParams.region);
    if (queryParams.spot) params.append("spot", queryParams.spot);
    if (queryParams.trip) params.append("trip", queryParams.trip);

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const mapUrl = getMapUrl();

  return (
    <section className={cn("w-full py-8 md:py-12 px-4", className)}>
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-800 to-indigo-950 shadow-2xl">
        {/* Animated Background Particles/Stars */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute top-10 left-10 h-2 w-2 rounded-full bg-white animate-pulse"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute top-1/4 right-1/4 h-1 w-1 rounded-full bg-blue-200 animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute bottom-20 left-1/3 h-1.5 w-1.5 rounded-full bg-indigo-300 animate-pulse"
            style={{ animationDuration: "2.5s" }}
          />
          <div
            className="absolute bottom-10 right-10 h-2 w-2 rounded-full bg-white animate-pulse"
            style={{ animationDuration: "5s" }}
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12 p-8 md:p-12 items-center relative z-10">
          {/* Text Content */}
          <div className="space-y-6 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur-sm border border-indigo-500/30 mb-4">
                <MapIcon className="h-3 w-3" />
                <span>New App Release</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl font-heading leading-tight">
                Tomokichi Globe
              </h2>
              <p className="mt-4 text-lg text-indigo-200/90 leading-relaxed">
                ともきちが訪れた場所を、美しい3D地球儀の上で振り返りませんか？
                <br className="hidden md:block" />
                旅の軌跡を地球儀で確認してみましょう。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-base font-semibold text-indigo-900 shadow-lg shadow-indigo-900/20 transition-all hover:bg-indigo-50 hover:scale-105 active:scale-95"
              >
                <span>地球儀を見る</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                <ExternalLink className="h-3 w-3 opacity-50 ml-1" />
              </Link>
            </motion.div>
          </div>

          {/* Graphic/Visual */}
          <div className="relative flex items-center justify-center min-h-[250px] md:min-h-[300px]">
            {/* Spinning Globe Representation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Glow effects */}
              <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full" />

              {/* Globe Icon Wrapper */}
              <div className="relative h-48 w-48 md:h-64 md:w-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-full h-full text-indigo-300/20"
                >
                  {/* Abstract Globe Lines using SVG */}
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full fill-none stroke-current stroke-[0.5]"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      strokeWidth="1"
                      className="stroke-indigo-400/50"
                    />
                    <path d="M50 2 A 48 48 0 0 1 50 98" />
                    <path d="M50 2 A 48 48 0 0 0 50 98" />
                    <path
                      d="M2 50 A 48 48 0 0 1 98 50"
                      className="stroke-indigo-400/50"
                    />
                    <ellipse cx="50" cy="50" rx="20" ry="48" />
                    <ellipse cx="50" cy="50" rx="35" ry="48" />
                    <path d="M10 30 Q 50 40 90 30" />
                    <path d="M10 70 Q 50 60 90 70" />
                  </svg>
                </motion.div>

                {/* Central Highlight/Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Globe
                      className="h-24 w-24 md:h-32 md:w-32 text-indigo-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                      strokeWidth={1}
                    />
                  </motion.div>
                </div>

                {/* Orbiting Elements */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                    <div className="h-3 w-3 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobePromo;
