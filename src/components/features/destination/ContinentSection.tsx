import Link from "next/link";
import { ContinentData } from "@/types/types";

interface ContinentSectionProps {
  continent: ContinentData;
  countryStyle?: string;
}

const ContinentSection = ({ continent, countryStyle }: ContinentSectionProps) => {
  return (
    <div key={continent.slug}>
      <h3 className={`mb-4 pb-2 text-2xl font-bold ${countryStyle}`}>{continent.name}</h3>
      <ul className="space-y-2">
        {continent.countries.map((country) => (
          <li key={country.slug}>
            <Link
              href={`/destination/${country.slug}`}
              className="text-foreground hover:text-secondary font-semibold"
            >
              ・{country.name}
            </Link>
            {country.children && country.children.length > 0 && (
              <ul className="mt-1 ml-6 space-y-1">
                {country.children.map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/destination/${city.slug}`}
                      className="text-foreground hover:text-secondary"
                    >
                      - {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContinentSection;
