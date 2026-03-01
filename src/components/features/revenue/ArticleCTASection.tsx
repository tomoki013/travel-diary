import { CTA_BY_CATEGORY } from "@/constants/revenue";
import { RevenueCategory } from "@/types/types";
import { ComparisonTable, ReviewCardGroup } from "./RevenueComponents";

const ArticleCTASection = ({
  revenueCategory,
}: {
  revenueCategory?: RevenueCategory;
}) => {
  const category = revenueCategory || "guide";
  const items = CTA_BY_CATEGORY[category];

  return (
    <section className="my-12 overflow-hidden rounded-3xl border border-teal-200/60 bg-gradient-to-br from-teal-50/80 via-background to-cyan-50/60 p-6 shadow-sm dark:border-teal-900/80 dark:from-teal-950/20 dark:via-background dark:to-cyan-950/20">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-bold text-white">
          NEXT ACTION
        </span>
        <h2 className="text-2xl font-bold">この記事の次にやること</h2>
      </div>

      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        今の内容を踏まえて、比較しやすい順番で次の行動を並べています。まずは上のカードから1つ選んで進めてください。
      </p>

      <ReviewCardGroup items={items} />

      <div className="mt-6 rounded-2xl border border-dashed border-teal-300/80 bg-background/70 p-3 dark:border-teal-800">
        <p className="mb-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
          比較ポイント一覧
        </p>
        <ComparisonTable items={items} />
      </div>
    </section>
  );
};

export default ArticleCTASection;
