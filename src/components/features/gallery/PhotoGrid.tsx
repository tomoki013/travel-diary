"use client";

import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { GalleryPhotoEntry } from "@/lib/gallery-discovery";

interface PhotoGridProps {
  photos: GalleryPhotoEntry[];
  onSelectPhoto: (entry: GalleryPhotoEntry) => void;
}

const PhotoGrid = ({ photos, onSelectPhoto }: PhotoGridProps) => {
  return (
    <m.div layout className="columns-2 gap-4 md:columns-3 lg:columns-4">
      <AnimatePresence initial={false}>
        {photos.map((entry) => {
          const { photo } = entry;

          return (
            <m.div
              layout
              key={photo.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => onSelectPhoto(entry)}
              className="group mb-4 cursor-pointer break-inside-avoid-column"
            >
              <div className="relative overflow-hidden rounded-xl shadow-md transition-shadow duration-300 hover:shadow-xl">
                <Image
                  src={photo.path}
                  alt={photo.title}
                  width={600}
                  height={400}
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pt-10 pb-4 text-white">
                  <p className="text-sm leading-snug font-semibold">{photo.title}</p>
                </div>
              </div>
            </m.div>
          );
        })}
      </AnimatePresence>
    </m.div>
  );
};

export default PhotoGrid;
