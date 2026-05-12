import Image from "next/image";

interface HeroSectionProps {
  src: string;
  alt: string;
  pageTitle?: string; // オプションでページタイトルを受け取る
  pageMessage?: string; // オプションでページメッセージを受け取る
  textColor?: string; // テキストの色を制御するprop
}

const HeroSection = ({
  src,
  alt,
  pageTitle,
  pageMessage,
  textColor = "text-white/80",
}: HeroSectionProps) => {
  return (
    <div className="text-foreground relative flex h-64 items-center justify-center md:h-80">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover brightness-50"
        priority
        sizes="100vw"
      />
      <div className={`relative z-10 text-center ${textColor}`}>
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">{pageTitle || ""}</h1>
        <p className="mt-2 text-lg md:text-xl">{pageMessage || ""}</p>
      </div>
    </div>
  );
};

export default HeroSection;
