"use client";

import { useState, useMemo } from "react";
import { Photo, Post } from "@/types/types";
type PostMetadata = Omit<Post, "content">;
import HeroSection from "@/components/pages/HeroSection";
import PhotoFilter from "@/components/features/gallery/PhotoFilter";
import PhotoGrid from "@/components/features/gallery/PhotoGrid";
import PhotoModal from "@/components/features/gallery/PhotoModal";
import { categoryMappings } from "@/data/photoCategories";
import {
  buildGalleryPhotoEntries,
  GalleryPhotoEntry,
} from "@/lib/gallery-discovery";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const filterList: string[] = ["すべて", ...Object.keys(categoryMappings)];

const categoryToFilterMap = new Map<string, string>();
for (const filterName in categoryMappings) {
  for (const category of categoryMappings[filterName]) {
    categoryToFilterMap.set(category, filterName);
  }
}

function getFilterCategory(category: string): string {
  return categoryToFilterMap.get(category) || "その他";
}

interface ClientProps {
  posts: PostMetadata[];
  photos: Photo[];
}

const Client = ({ posts, photos }: ClientProps) => {
  const [activeFilter, setActiveFilter] = useState("すべて");
  const [selectedEntry, setSelectedEntry] = useState<GalleryPhotoEntry | null>(null);

  const photoEntries = useMemo(
    () => buildGalleryPhotoEntries(photos, posts),
    [photos, posts],
  );

  useBodyScrollLock(selectedEntry !== null);

  const filteredPhotos = useMemo(
    () =>
      activeFilter === "すべて"
        ? photoEntries
        : photoEntries.filter(({ photo }) =>
            photo.categories.some(
              (category) => getFilterCategory(category) === activeFilter
            )
          ),
    [activeFilter, photoEntries],
  );

  const handleSelectPhoto = (entry: GalleryPhotoEntry) => {
    setSelectedEntry(entry);
  };

  const handleCloseModal = () => {
    setSelectedEntry(null);
  };

  const handleNext = () => {
    if (selectedEntry) {
      const currentIndex = filteredPhotos.findIndex(
        (entry) => entry.photo.id === selectedEntry.photo.id,
      );
      const nextIndex = (currentIndex + 1) % filteredPhotos.length;
      handleSelectPhoto(filteredPhotos[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (selectedEntry) {
      const currentIndex = filteredPhotos.findIndex(
        (entry) => entry.photo.id === selectedEntry.photo.id,
      );
      const prevIndex =
        (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
      handleSelectPhoto(filteredPhotos[prevIndex]);
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection
        src="/images/Turkey/balloons-in-cappadocia.jpg"
        alt="Gallery Hero Image"
        pageTitle="Gallery"
        pageMessage="気になった景色から、旅先の記事へ"
        textColor="text-foreground"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-10 text-center text-muted-foreground space-y-4 max-w-3xl mx-auto">
          <p>
            これまでの旅先で撮影した風景や日常のワンシーンをまとめた写真ギャラリーです。アジアの熱気ある街並みからヨーロッパの歴史的な建築、自然が織りなす絶景まで、世界各地の様子を記録しています。
          </p>
          <p>
            気になる写真を見つけたら、クリックして詳細をご覧ください。その写真が撮影された場所の旅行記や、現地のアクセス・観光情報などの関連記事へ直接アクセスすることができます。次の旅行先探しのインスピレーションとしてぜひご活用ください。
          </p>
        </section>
        <PhotoFilter
          filterList={filterList}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <PhotoGrid photos={filteredPhotos} onSelectPhoto={handleSelectPhoto} />
      </div>

      <PhotoModal
        selectedEntry={selectedEntry}
        photoCount={filteredPhotos.length}
        photoIndex={
          selectedEntry
            ? filteredPhotos.findIndex(
                (entry) => entry.photo.id === selectedEntry.photo.id,
              )
            : -1
        }
        onClose={handleCloseModal}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default Client;
