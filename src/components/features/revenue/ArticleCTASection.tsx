import { CTA_BY_CATEGORY } from "@/constants/revenue";
import { RevenueCategory } from "@/types/types";
import { ComparisonTable, ReviewCardGroup } from "./RevenueComponents";

const ArticleCTASection = ({ revenueCategory }: { revenueCategory?: RevenueCategory }) => {
  const category = revenueCategory || "guide";
  const items = CTA_BY_CATEGORY[category];

  return (
    <section className="my-10 space-y-4 rounded-2xl border bg-card p-6">
      <h2 className="text-2xl font-bold">この記事の次にやること</h2>
      <p className="text-sm text-muted-foreground">文脈に合わせて、次の比較・予約アクションをまとめました。</p>
      <ReviewCardGroup items={items} />
      <ComparisonTable items={items} />
    </section>
  );
};

export default ArticleCTASection;
