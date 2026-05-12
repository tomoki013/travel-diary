import Link from "next/link";
import Image from "next/image";
import { Link as LinkIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { PRIMARY_SITE_URL } from "@/constants/site";

interface LinkCardProps {
  href: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  variant: "standard" | "analog" | "minimal";
}

const getAnalogRotation = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 2000;
  }
  return hash / 1000 - 1;
};

export const LinkCard = ({ href, title, excerpt, imageUrl, variant }: LinkCardProps) => {
  const resolvedUrl = new URL(href, `${PRIMARY_SITE_URL}/posts/`);
  const displayUrl = `${resolvedUrl.hostname}${resolvedUrl.pathname}${resolvedUrl.search}`;

  // ===== スタンダード型 =====
  if (variant === "standard") {
    return (
      <Link
        href={href}
        className="group not-prose my-6 flex flex-col items-center rounded-lg border border-gray-200 bg-white/80 p-4 shadow-sm transition-colors md:flex-row md:gap-4"
      >
        {imageUrl && (
          <div className="flex-shrink-0 md:w-1/4">
            <Image
              src={imageUrl}
              alt={title}
              width={400}
              height={300}
              sizes="(max-width: 768px) 100vw, 200px"
              className="aspect-video rounded-md object-cover"
            />
          </div>
        )}
        <p className="flex-grow">
          <p className="text-foreground group-hover:text-muted-foreground font-bold">{title}</p>
          <Separator />
          {excerpt && (
            <p className="text-foreground group-hover:text-muted-foreground mt-1 line-clamp-2 text-sm">
              {excerpt}
            </p>
          )}
          <p className="text-muted-foreground mt-2 flex items-center gap-1 text-xs underline">
            <LinkIcon size={12} /> {displayUrl}
          </p>
        </p>
      </Link>
    );
  }

  // ===== アナログ・日記風 =====
  if (variant === "analog") {
    return (
      <Link
        href={href}
        className="group my-8 block transition-transform duration-300 hover:!rotate-0"
        style={{ transform: `rotate(${getAnalogRotation(href)}deg)` }}
      >
        <p className="relative rounded-md bg-white p-3 pb-8 shadow-lg">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              width={800}
              height={600}
              className="aspect-[4/3] rounded-sm border-2 border-gray-100 object-cover"
            />
          )}
          <p className="text-foreground absolute right-0 bottom-2 left-0 mt-3 text-center font-serif font-semibold">
            {title}
          </p>
        </p>
      </Link>
    );
  }

  // ===== ミニマル・コンパクト型 =====
  if (variant === "minimal") {
    return (
      <Link
        href={href}
        className="group border-secondary my-4 block border-l-4 bg-white/80 p-4 transition-colors"
      >
        <p className="text-foreground group-hover:text-muted-foreground font-bold">{title}</p>
        <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
          <LinkIcon size={12} /> {displayUrl}
        </p>
      </Link>
    );
  }

  return null;
};
