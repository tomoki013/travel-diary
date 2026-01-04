import { affiliates } from "@/constants/affiliates";
import AffiliateCard from "@/components/common/AffiliateCard";

interface AffiliateSectionProps {
  category: string;
  title: string;
  description?: string;
}

const AffiliateSection = ({
  category,
  title,
  description,
}: AffiliateSectionProps) => {
  const filteredAffiliates = affiliates.filter(
    (affiliate) =>
      affiliate.categories?.includes(category) && affiliate.status === "ready"
  );

  if (filteredAffiliates.length === 0) return null;

  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAffiliates.map((affiliate) => (
          <AffiliateCard
            key={affiliate.name}
            affiliate={affiliate}
            type={affiliate.type}
          />
        ))}
      </div>
    </div>
  );
};

export default AffiliateSection;
