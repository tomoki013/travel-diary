import { Reveal } from "@/components/common/Reveal";
import Button from "../common/Button";

interface GalleryLengthProps {
  galleryLength: number;
}

const GalleryLength = ({ galleryLength }: GalleryLengthProps) => {
  return (
    <Reveal as="section" className="mx-auto max-w-5xl px-6 py-24 md:px-8">
      <div className="mb-16 text-center">
        <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
          世界で出会った景色
        </h2>
        <div className="bg-secondary mx-auto mt-6 h-0.5 w-24" />
      </div>
      <div className="mt-8 mb-12 flex flex-col items-center gap-2 text-center">
        <p className="text-muted-foreground text-sm font-medium tracking-wide">PHOTOS</p>
        <p className="text-xl font-bold md:text-2xl">
          <span className="text-primary text-5xl font-extrabold tracking-tighter md:text-6xl">
            {galleryLength}
          </span>
          <span className="text-muted-foreground ml-2 text-xl font-normal">枚</span>
        </p>
      </div>
      <Button href={`/gallery`}>写真から記事を探す</Button>
    </Reveal>
  );
};

export default GalleryLength;
