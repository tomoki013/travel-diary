"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GalleryPhotoEntry } from "@/lib/gallery-discovery";

interface PhotoGridProps {
  photos: GalleryPhotoEntry[];
  onSelectPhoto: (entry: GalleryPhotoEntry) => void;
}

const PhotoGrid = ({ photos, onSelectPhoto }: PhotoGridProps) => {
  return (
    <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-4">
      <AnimatePresence>
        {photos.map((entry) => {
          const { photo, relatedPost, destinationHref } = entry;
          const entryLabel = relatedPost
            ? "関連する記事へ"
            : destinationHref
              ? "この地域の記事へ"
              : null;

          return (
          <motion.div
            layout
            key={photo.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onSelectPhoto(entry)}
            className="group mb-4 break-inside-avoid-column cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-xl shadow-md transition-shadow duration-300 hover:shadow-xl">
              <Image
                src={photo.path}
                alt={photo.title}
                width={600}
                height={400}
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pb-4 pt-10 text-white">
                <p className="text-sm font-semibold leading-snug">{photo.title}</p>
                {entryLabel && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    {entryLabel}
                    <ArrowUpRight size={14} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default PhotoGrid;
