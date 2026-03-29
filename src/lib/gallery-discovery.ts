import { Photo, PostMetadata } from "@/types/types";
import { getRegionBySlug } from "@/lib/regionUtil";

export type GalleryPhotoEntry = {
  photo: Photo;
  relatedPost: PostMetadata | null;
  destinationHref: string | null;
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[・、。"'`’“”]/g, "");

export const findRelatedPostForPhoto = (
  photo: Photo,
  posts: PostMetadata[],
): PostMetadata | null => {
  const exactImageMatch = posts.find((post) => post.image === photo.path);
  if (exactImageMatch) {
    return exactImageMatch;
  }

  const normalizedPhotoTitle = normalizeText(photo.title);
  const locationMatches = posts.filter((post) =>
    post.location?.includes(photo.location),
  );

  const exactTitleMatch = locationMatches.find((post) => {
    const normalizedPostTitle = normalizeText(post.title);
    return (
      normalizedPostTitle.includes(normalizedPhotoTitle) ||
      normalizedPhotoTitle.includes(normalizedPostTitle)
    );
  });

  if (exactTitleMatch) {
    return exactTitleMatch;
  }

  return null;
};

export const getDestinationHrefForPhoto = (photo: Photo) => {
  const region = getRegionBySlug(photo.location);
  return region ? `/destination/${region.slug}` : null;
};

export const buildGalleryPhotoEntries = (
  photos: Photo[],
  posts: PostMetadata[],
): GalleryPhotoEntry[] =>
  photos.map((photo) => ({
    photo,
    relatedPost: findRelatedPostForPhoto(photo, posts),
    destinationHref: getDestinationHrefForPhoto(photo),
  }));
