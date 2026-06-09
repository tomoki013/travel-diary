import Image from "next/image";
import Link from "next/link";
import { AffiliatesProps } from "@/types/types";
import LazyAffiliateBanner from "./LazyAffiliateBanner";

type AffiliateCardProps = {
  affiliate: AffiliatesProps;
  type?: "link" | "card" | "banner";
};

const AffiliateCard = ({ affiliate, type = "link" }: AffiliateCardProps) => {
  const { affiliateUrl, name, description, icon, image, bannerHtml } = affiliate;

  const renderContent = () => {
    switch (type) {
      case "link":
        return (
          <Link
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {name}
          </Link>
        );
      case "card":
        return (
          <Link
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-card flex h-full transform flex-col items-center rounded-lg p-6 text-center shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center">
              {image ? (
                <Image
                  src={image}
                  alt={`${name} ロゴ`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                icon
              )}
            </div>
            <h3 className="text-foreground mb-2 text-lg font-bold">{name}</h3>
            <p className="text-muted-foreground flex-grow">{description}</p>
          </Link>
        );
      case "banner":
        if (!bannerHtml) return null;
        return <LazyAffiliateBanner bannerHtml={bannerHtml} name={name} />;
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};

export default AffiliateCard;
