import type { Metadata } from "next";
import Link from "next/link";
import { Bot, CircleHelp, LockKeyhole, RefreshCw } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import { STORE_LEGAL_URL, storeProducts } from "@/lib/store/catalog";

export const metadata: Metadata = {
  title: "旅の道具店",
  description:
    "実際の旅行と個人開発から生まれた、旅程整理や旅行準備に役立つデジタル商品を販売しています。",
  alternates: {
    canonical: "/store",
  },
};

const principles = [
  {
    icon: LockKeyhole,
    title: "個人情報を増やさない",
    description:
      "ログインを前提にせず、可能な限り端末内で完結する商品を優先します。",
  },
  {
    icon: RefreshCw,
    title: "改善版も届ける",
    description:
      "購入後に内容を改善した場合は、販売プラットフォーム経由で更新版を案内します。",
  },
  {
    icon: Bot,
    title: "AIで素早くサポート",
    description:
      "よくある質問はAIが一次対応し、返金・法務・個人情報など重要な内容は人が確認します。",
  },
];

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-primary text-xs font-bold tracking-[0.24em] uppercase">
          Tomokichi Travel Tools
        </p>
        <h1 className="font-heading mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          旅の道具店
        </h1>
        <p className="text-muted-foreground mt-5 text-base leading-8 sm:text-lg">
          自分の旅行で本当に必要だったものを、小さなデジタル商品としてまとめています。
          大量の情報ではなく、旅の準備と記録を少し軽くする道具を届けます。
        </p>
      </header>

      <section className="mx-auto mt-12 max-w-5xl space-y-8" aria-label="商品一覧">
        {storeProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </section>

      <section className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-3">
        {principles.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="border-border/70 bg-card/65 rounded-2xl border p-6 shadow-sm"
          >
            <Icon className="text-primary h-6 w-6" aria-hidden="true" />
            <h2 className="font-heading mt-4 text-lg font-bold">{title}</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">{description}</p>
          </article>
        ))}
      </section>

      <section className="border-border/70 bg-muted/30 mx-auto mt-12 flex max-w-5xl flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CircleHelp className="text-primary mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <h2 className="font-heading font-bold">購入前でも質問できます</h2>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              対応環境、商品の内容、ダウンロード方法など、不明点を送ってください。
            </p>
          </div>
        </div>
        <Link
          href="/store/support"
          className="border-border bg-background hover:bg-accent shrink-0 rounded-full border px-5 py-2.5 text-center text-sm font-bold transition"
        >
          サポートへ
        </Link>
      </section>

      <footer className="text-muted-foreground mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
        <Link href={STORE_LEGAL_URL} className="hover:text-foreground underline underline-offset-4">
          販売条件・利用規約
        </Link>
        <Link href="/privacy" className="hover:text-foreground underline underline-offset-4">
          プライバシーポリシー
        </Link>
      </footer>
    </div>
  );
}
