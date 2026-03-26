import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "執筆・編集ポリシー",
  description:
    "ともきちの旅行日記の記事がどのような基準で書かれ、更新されているかをまとめたページです。体験談と実用情報の扱い、情報確認の方針、公式リンクの考え方などを説明しています。",
  openGraph: {
    title: "執筆・編集ポリシー",
    description:
      "ともきちの旅行日記の記事がどのような基準で書かれ、更新されているかをまとめたページです。体験談と実用情報の扱い、情報確認の方針、公式リンクの考え方などを説明しています。",
  },
  twitter: {
    title: "執筆・編集ポリシー",
    description:
      "ともきちの旅行日記の記事がどのような基準で書かれ、更新されているかをまとめたページです。体験談と実用情報の扱い、情報確認の方針、公式リンクの考え方などを説明しています。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const EditorialPolicyPage = () => {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:mx-8">
        <h1 className="mb-8 text-4xl font-bold">執筆・編集ポリシー</h1>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p>
            当サイト「ともきちの旅行日記」では、旅の体験そのものを伝える記事と、現地で役立つ実用記事を同じ書き方で扱わないようにしています。このページでは、記事をどのような考え方で書き、更新しているかを公開向けに整理しています。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">1. このページの目的</h2>
          <p>
            当サイトでは、旅行記、観光情報、移動方法、予約や料金に関する記事など、性格の違う記事を扱っています。そのため、どの記事でも同じ温度感で書くのではなく、読者が求めているものに応じて、体験談と客観情報の比重を調整しています。
          </p>
          <p>
            読者の方にとって「どこまでが体験談で、どこからが補足情報か」が分かる状態を目指すことが、このポリシーの基本です。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">2. 記事カテゴリごとの基本方針</h2>
          <h3 className="text-xl font-bold">旅行記・シリーズ記事</h3>
          <p>
            旅行記やシリーズ記事では、その日の空気感、驚き、失敗、疲れ、満足感など、現地で実際に感じたことを大切にしています。単なる観光ガイドではなく、旅の流れが追える読みものとして書きます。
          </p>

          <h3 className="text-xl font-bold">観光・移動・実用記事</h3>
          <p>
            実用性が高い記事では、正確さと分かりやすさを優先します。料金、アクセス、注意点、比較軸など、読者の判断に役立つ要素を先に整理し、体験談は意思決定に役立つ範囲に絞って使います。
          </p>

          <h3 className="text-xl font-bold">単発の考察・まとめ記事</h3>
          <p>
            比較や意見を含む記事では、結論を先に示しつつ、なぜそう考えるのかが読者に伝わるように構成します。煽りや断定だけで押し切る書き方は避けます。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">3. 情報の確認方針</h2>
          <p>
            営業時間、料金、運行情報、入場条件など変わりやすい情報は、原則として著者が現地で直接確認した内容を優先します。
          </p>
          <p>
            一方で、執筆時点では現地で再確認できない内容や、制度変更があり得る情報については、公式サイトや公式案内を補足として参照します。その場合は、本文中で「公式サイトでは」「公式案内では」「ネット上では」といった形で、どの種類の情報かが分かるように書き分けます。
          </p>
          <p>
            現地で見た内容と、後から確認した補足情報が混ざるときは、その区別が読めるようにすることを重視しています。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">4. 公式リンクと外部情報の扱い</h2>
          <p>
            当サイトでは、読者が最終確認に使えるよう、公式サイト、公式予約ページ、公式運行案内などの一次情報へのリンクを積極的に掲載します。
          </p>
          <p>
            一方で、根拠の弱いまとめサイトや、情報の出どころが曖昧な外部記事に依存することは避けています。外部リンクを置く場合も、何を確認するためのリンクなのかが分かるようにすることを基本にしています。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">5. AI の利用について</h2>
          <p>
            当サイトでは、記事制作や運営の一部に AI を活用することがあります。たとえば、情報整理、構成の下書き、更新作業の補助、表記ゆれの確認などで AI を使う場合があります。
          </p>
          <p>
            ただし、公開する記事の内容は、最終的に執筆者が確認し、必要に応じて修正したうえで掲載します。現地での体験や判断、掲載可否の最終決定を AI に委ねることはありません。
          </p>
          <p>
            体験談の中核や、実際に見たこと・感じたこと・確認したことは、執筆者自身の責任で扱います。AI はあくまで補助的なツールとして利用します。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">6. 広告・アフィリエイトとの関係</h2>
          <p>
            当サイトでは、アフィリエイトプログラムを利用する記事があります。ただし、紹介する商品やサービスは、運営者が実際に使ったもの、または明確な体験と判断材料を持って書けるものを優先しています。
          </p>
          <p>
            詳しい基準については
            <Link
              href="/affiliates"
              className="text-primary underline hover:text-secondary"
            >
              アフィリエイトポリシー
            </Link>
            をご確認ください。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">7. 記事の修正・更新について</h2>
          <p>
            記事公開後も、誤記修正、情報更新、内部リンク整理、表現の調整を行うことがあります。特に、料金やルールが変わりやすいテーマでは、必要に応じて追記や補正を行います。
          </p>
          <p>
            ただし、旅先で感じた印象や、その時点の体験そのものは、後から都合よく書き換えないようにしています。体験談の温度感は残しつつ、客観情報だけを補正するのが基本方針です。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">8. 関連ポリシー</h2>
          <ul className="list-disc pl-6">
            <li>
              個人情報や免責事項については
              <Link
                href="/privacy"
                className="text-primary underline hover:text-secondary"
              >
                プライバシーポリシー
              </Link>
              をご確認ください。
            </li>
            <li>
              サイト利用条件については
              <Link
                href="/terms"
                className="text-primary underline hover:text-secondary"
              >
                利用規約
              </Link>
              をご確認ください。
            </li>
            <li>
              Cookie の取り扱いについては
              <Link
                href="/cookie-policy"
                className="text-primary underline hover:text-secondary"
              >
                クッキーポリシー
              </Link>
              をご確認ください。
            </li>
          </ul>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">9. お問い合わせ</h2>
          <p>
            このページの内容や、記事の記載方針についてのお問い合わせは、
            <Link
              href="/contact"
              className="text-primary underline hover:text-secondary"
            >
              お問い合わせフォーム
            </Link>
            よりご連絡ください。
          </p>

          <Separator className="my-8" />

          <p className="text-sm text-muted-foreground">最終更新日：2026年3月26日</p>
        </div>
      </div>
    </div>
  );
};

export default EditorialPolicyPage;
