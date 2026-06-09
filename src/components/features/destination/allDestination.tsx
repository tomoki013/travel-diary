import { Reveal } from "@/components/common/Reveal";
import { AllDestinationProps } from "@/types/types";
import ContinentSection from "./ContinentSection";

interface PageProps extends AllDestinationProps {
  className: string;
  countryStyle?: string;
}

const AllDestination = ({ regionData, className, countryStyle }: PageProps) => {
  return (
    <Reveal as="section">
      <div className={`${className}`}>
        {regionData.map((continent) => (
          <ContinentSection
            key={continent.slug}
            continent={continent}
            countryStyle={countryStyle}
          />
        ))}
      </div>
    </Reveal>
  );
};

export default AllDestination;
