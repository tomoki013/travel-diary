import { ArrowRight, Check, Clock3, Download, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { StoreProduct } from "@/lib/store/catalog";

export default function ProductCard({ product }: { product: StoreProduct }) {
  const isAvailable = Boolean(product.checkoutUrl);

  return (
    <article className="border-border/70 bg-card/80 overflow-hidden rounded-3xl border shadow-sm backdrop-blur">
      <div className="border-border/60 bg-muted/35 border-b px-6 py-5 sm:px-8">
        <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
          {product.eyebrow}
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">{product.name}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl leading-7">
              {product.description}
            </p>
          </div>
          <p className="font-heading text-3xl font-bold">{product.priceLabel}</p>
        </div>
      </div>

      <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <h3 className="font-heading text-lg font-bold">含まれるもの</h3>
          <ul className="mt-4 space-y-3">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary mt-0.5 rounded-full p-1">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-foreground/85">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-background/75 border-border/70 rounded-2xl border p-5">
          <dl className="space-y-4 text-sm">
            <div className="flex gap-3">
              <Download className="text-primary h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <dt className="font-bold">受け取り</dt>
                <dd className="text-muted-foreground mt-1">{product.delivery}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="text-primary h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <dt className="font-bold">向いている人</dt>
                <dd className="text-muted-foreground mt-1 leading-6">{product.idealFor}</dd>
              </div>
            </div>
          </dl>

          {isAvailable ? (
            <a
              href={product.checkoutUrl}
              className="bg-primary text-primary-foreground mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-bold shadow-sm transition hover:opacity-90"
              rel="noopener noreferrer"
            >
              購入する
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <div className="bg-muted text-muted-foreground mt-6 flex items-center justify-center gap-2 rounded-full px-5 py-3 font-bold">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              販売準備中
            </div>
          )}

          <Link
            href={`/store/support?product=${encodeURIComponent(product.slug)}`}
            className="text-muted-foreground hover:text-foreground mt-4 block text-center text-xs underline underline-offset-4"
          >
            購入前の質問・購入後のサポート
          </Link>
        </div>
      </div>
    </article>
  );
}
