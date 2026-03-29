"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowLeft, ArrowRight, MapPin, BookOpenText } from "lucide-react";
import { modal } from "@/components/common/animation";
import { GalleryPhotoEntry } from "@/lib/gallery-discovery";
import { getRegionBySlug } from "@/lib/regionUtil";

interface PhotoModalProps {
  selectedEntry: GalleryPhotoEntry | null;
  photoCount: number;
  photoIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const PhotoModal = ({
  selectedEntry,
  photoCount,
  photoIndex,
  onClose,
  onNext,
  onPrev,
}: PhotoModalProps) => {
  const selectedPhoto = selectedEntry?.photo;
  const relatedPost = selectedEntry?.relatedPost;
  const destinationHref = selectedEntry?.destinationHref;
  let location;
  if (selectedPhoto) location = getRegionBySlug(selectedPhoto.location);
  return (
    <AnimatePresence>
      {selectedPhoto && (
        <motion.div
          key="modal-overlay"
          variants={modal.overlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          {/* Photo Counter */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-black/50 text-white text-sm rounded-full px-3 py-1">
              {photoIndex + 1} / {photoCount}
            </div>
          </div>

          <motion.div
            key="modal-content"
            variants={modal.content}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white text-black rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col md:flex-row overflow-y-auto md:overflow-y-hidden"
          >
            {/* Image Display */}
            <div className="w-full md:w-2/3 h-64 md:h-auto flex items-center justify-center bg-black">
              <Image
                src={selectedPhoto.path}
                alt={selectedPhoto.title}
                width={1600}
                height={1200}
                className="object-contain w-full h-full"
              />
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/3 p-6 flex flex-col">
              {location && (
                <span className="text-muted-foreground mb-2 text-sm">
                  <MapPin className="inline-block mr-2 text-teal-600" />
                  {location.name}
                </span>
              )}
              <h2 className="text-2xl font-bold mb-2">{selectedPhoto.title}</h2>

              {/* Description with scroll */}
              <div className="flex-grow overflow-y-auto mb-4">
                <p className="text-gray-600">{selectedPhoto.description}</p>
              </div>

              {/* Related Article Link */}
              {(relatedPost || destinationHref) && (
                <div className="mt-auto rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <BookOpenText size={16} />
                    {relatedPost
                      ? "この写真から読める記事"
                      : "この地域の記事へ進む"}
                  </div>
                  {relatedPost ? (
                    <>
                      <p className="text-base font-bold text-gray-900">
                        {relatedPost.title}
                      </p>
                      {relatedPost.excerpt && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-3">
                          {relatedPost.excerpt}
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href={`/posts/${relatedPost.slug}`}
                          className="group inline-flex items-center rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                        >
                          記事を読む
                          <ArrowRight
                            className="ml-2 transition-transform group-hover:translate-x-1"
                            size={16}
                          />
                        </Link>
                        {destinationHref && location && (
                          <Link
                            href={destinationHref}
                            className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-white"
                          >
                            {location.name}の記事を見る
                          </Link>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed text-gray-600">
                        この写真に対応する個別記事はまだ紐づいていませんが、
                        {location?.name || "この地域"}の記事一覧から旅先の情報を見られます。
                      </p>
                      <Link
                        href={destinationHref || "/destination"}
                        className="group mt-4 inline-flex items-center text-teal-600 font-semibold"
                      >
                        {location?.name || "地域"}の記事を見る
                        <ArrowRight
                          className="inline-block ml-2 transition-transform group-hover:translate-x-1"
                          size={18}
                        />
                      </Link>
                    </>
                  )}
                </div>
              )}

              {!relatedPost && !destinationHref && (
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <Link
                    href="/posts"
                    className="group inline-flex items-center text-teal-600 font-semibold"
                  >
                    Blog 一覧から記事を探す
                    <ArrowRight
                      className="inline-block ml-2 transition-transform group-hover:translate-x-1"
                      size={18}
                    />
                  </Link>
                </div>
              )}
            </div>

            {/* Controls */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2 hover:bg-black/75"
            >
              <X size={24} />
            </button>
            {photoCount > 1 && (
              <>
                <button
                  onClick={onPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/75"
                >
                  <ArrowLeft size={24} />
                </button>
                <button
                  onClick={onNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/75"
                >
                  <ArrowRight size={24} />
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoModal;
