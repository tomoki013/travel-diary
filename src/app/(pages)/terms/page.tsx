import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約",
  description:
    "ともきちの旅行日記の利用規約です。サイトの利用条件や禁止事項、免責事項などを詳しく説明しています。",
  openGraph: {
    title: "利用規約",
    description:
      "ともきちの旅行日記の利用規約です。サイトの利用条件や禁止事項、免責事項などを詳しく説明しています。",
  },
  twitter: {
    title: "利用規約",
    description:
      "ともきちの旅行日記の利用規約です。サイトの利用条件や禁止事項、免責事項などを詳しく説明しています。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const TermsPage = () => {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:mx-8">
        <h1 className="mb-8 text-4xl font-bold">利用規約</h1>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p>
            この利用規約（以下、「本規約」）は、当サイト「ともきちの旅行日記」（以下、「当サイト」）の利用条件を定めるものです。ユーザーの皆様（以下、「ユーザー」）には本規約に従って当サイトをご利用いただきます。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">第1条（適用）</h2>
          <p>
            本規約は、ユーザーと当サイトとの間の本サービスの利用に関わる一切の関係に適用されるものとします。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">第2条（禁止事項）</h2>
          <p>
            ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません：
          </p>
          <ul className="list-disc pl-6">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>
              当サイトのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
            </li>
            <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
            <li>他のユーザーになりすます行為</li>
            <li>
              当サイトのサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
            </li>
            <li>
              当サイトのコンテンツ（文章、画像、動画等）を無断で転載、複製、配布する行為
            </li>
            <li>その他、当サイトが不適切と判断する行為</li>
          </ul>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">
            第3条（本サービスの提供の停止等）
          </h2>
          <p>
            当サイトは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします：
          </p>
          <ul className="list-disc pl-6">
            <li>
              本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
            </li>
            <li>
              地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
            </li>
            <li>コンピュータまたは通信回線等が事故により停止した場合</li>
            <li>その他、当サイトが本サービスの提供が困難と判断した場合</li>
          </ul>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">
            第4条（著作権およびコンテンツの利用）
          </h2>
          <p>
            当サイトに掲載されているコンテンツ（文章、画像、動画等）の著作権は、当サイトまたは正当な権利者に帰属します。ユーザーは、著作権法で認められる私的利用の範囲を超えて、無断で複製、転用、販売などの二次利用を行うことはできません。
          </p>
          <p>
            ただし、当サイトへのリンクは原則として自由です。リンクを行う場合の許可や連絡は不要です。記事の引用は、引用元を明記し、著作権法上の引用の要件を満たす形であれば問題ありません。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">第5条（免責事項）</h2>
          <p>
            当サイトの情報は、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなったりする場合があります。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。また、当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等についても一切の責任を負いません。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">
            第6条（Cookieとアクセス解析ツールについて）
          </h2>
          <p>
            当サイトは、サービスの品質向上とユーザー体験の改善を目的として、Cookie（クッキー）およびGoogle
            Analyticsなどのアクセス解析ツールを利用しています。これにより、ユーザーのサイト利用状況に関する情報を匿名で収集しますが、個人を特定するものではありません。詳細については、別途定める
            <Link
              href="/cookie-policy"
              className="text-primary underline hover:text-secondary"
            >
              クッキーポリシー
            </Link>
            をご確認ください。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">第7条（サービス内容の変更等）</h2>
          <p>
            当サイトは、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">第8条（利用規約の変更）</h2>
          <p>
            当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">第9条（準拠法・裁判管轄）</h2>
          <p>
            本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当サイトの運営者の所在地を管轄する裁判所を専属的合意管轄とします。
          </p>

          <Separator className="my-8" />

          <p className="text-sm text-muted-foreground">
            最終更新日：2025年8月21日
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
