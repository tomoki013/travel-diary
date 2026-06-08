import { Reveal, RevealStagger } from "@/components/common/Reveal";
import { affiliates } from "@/constants/affiliates";
import AffiliateCard from "../common/AffiliateCard";
import { ENABLE_AFFILIATES } from "@/constants/site";

const Affiliates = () => {
  if (!ENABLE_AFFILIATES) return null;

  const appsToShow = affiliates.filter((aff) => aff.status === "ready");

  return (
    <Reveal as="section" className="mx-auto max-w-5xl px-6 py-24 md:px-8">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
            旅の予約におすすめのサイト・アプリ
          </h2>
          <p className="text-muted-foreground mt-2">
            旅行の準備がもっと楽しく、スムーズになる予約ツールを集めました。
          </p>
        </div>
        <RevealStagger className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
          {appsToShow.map((app) => (
            <Reveal
              key={app.affiliateUrl}
              className={app.type === "banner" ? "md:col-span-2 lg:col-span-3" : ""}
            >
              <AffiliateCard affiliate={app} type={app.type} />
            </Reveal>
          ))}
        </RevealStagger>
      </div>
    </Reveal>
  );
};

export default Affiliates;
