"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

interface LazyAffiliateBannerProps {
  bannerHtml: string;
  name: string;
}

const LazyAffiliateBanner = ({ bannerHtml, name }: LazyAffiliateBannerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex min-h-[125px] w-full items-center justify-center">
      {isLoaded ? (
        <div className="w-full" dangerouslySetInnerHTML={{ __html: bannerHtml }} />
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 p-4 dark:border-stone-800 dark:bg-stone-900/30">
          <p className="text-xs font-bold tracking-widest text-stone-400 uppercase">{name}</p>
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <ExternalLink className="h-4 w-4" />
            <span>広告を表示中...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyAffiliateBanner;
