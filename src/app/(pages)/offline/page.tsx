// これがないとオフライン用キャッシュに含まれないことがあるので必須
export const dynamic = "force-static";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="mb-8 scale-150">
        <div className="loader-compass">
          <div className="rose" />
          <div className="marker n">N</div>
          <div className="marker s">S</div>
          <div className="marker w">W</div>
          <div className="marker e">E</div>
          <div className="needle" />
        </div>
      </div>

      <h1 className="font-heading text-4xl font-bold mb-4 text-foreground">
        Connection Lost
      </h1>

      <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
        インターネット接続が切れているようです。
        <br />
        電波の届く場所でリロードするか、オフラインで閲覧可能なページをご覧ください。
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default" className="w-full sm:w-auto">
          <Link href="/">トップページへ戻る</Link>
        </Button>
      </div>
    </div>
  );
}
