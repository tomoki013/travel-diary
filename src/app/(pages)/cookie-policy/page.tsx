import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "クッキーポリシー",
  description:
    "ともきちの旅行日記のクッキーポリシーです。Cookieの使用目的、種類、および管理方法について詳しく説明しています。",
  openGraph: {
    title: "クッキーポリシー",
    description:
      "ともきちの旅行日記のクッキーポリシーです。Cookieの使用目的、種類、および管理方法について詳しく説明しています。",
  },
  twitter: {
    title: "クッキーポリシー",
    description:
      "ともきちの旅行日記のクッキーポリシーです。Cookieの使用目的、種類、および管理方法について詳しく説明しています。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const CookiePolicyPage = () => {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:mx-8">
        <h1 className="mb-8 text-4xl font-bold">クッキーポリシー</h1>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p>
            当サイト「ともきちの旅行日記」（以下、「当サイト」）では、お客様により良いサービスを提供し、快適にサイトをご利用いただくために、Cookie（クッキー）を使用しています。本クッキーポリシーでは、Cookieの定義、収集する情報の種類、その使用目的、およびお客様がCookieの設定を管理する方法について詳しくご説明いたします。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">1. Cookieとは</h2>
          <p>
            Cookieとは、ウェブサイトにアクセスした際に、お客様のコンピュータ（PC、スマートフォン、タブレットなどのインターネット接続可能な機器）内に保存される小さなテキストファイルのことです。
          </p>
          <p>
            Cookieを使用することで、サーバーはお客様が特定のページを訪れたことや、ログイン状態などを認識することができ、次回以降のアクセス時に、よりスムーズかつパーソナライズされた体験を提供することが可能になります。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">2. 利用目的</h2>
          <p>当サイトでは、以下の目的でCookieを使用します：</p>
          <ul className="list-disc pl-6">
            <li>
              <strong>お客様の利便性向上：</strong>
              サイト設定の保存、ログイン状態の維持など、サイトの基本機能を提供するため。
            </li>
            <li>
              <strong>アクセス解析：</strong>
              サイトの利用状況（訪問者数、閲覧ページ、滞在時間など）を分析し、コンテンツやサービスの改善に役立てるため。
            </li>
            <li>
              <strong>広告配信：</strong>
              お客様の興味・関心に基づいた適切な広告を配信するため。これには、第三者配信事業者による広告サービスが含まれます。
            </li>
          </ul>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">3. 使用しているツールについて</h2>

          <h3 className="text-xl font-bold mt-6">Google Analytics</h3>
          <p>
            当サイトでは、Google社の提供するアクセス解析ツール「Google
            Analytics」を利用しています。Google
            Analyticsは、トラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
          </p>
          <ul className="list-disc pl-6">
            <li>
              <Link
                href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-secondary"
              >
                Google Analytics利用規約
              </Link>
            </li>
            <li>
              <Link
                href="https://policies.google.com/privacy?hl=ja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-secondary"
              >
                Googleプライバシーポリシー
              </Link>
            </li>
          </ul>

          <h3 className="text-xl font-bold mt-6">Google AdSense</h3>
          <p>
            当サイトでは、第三者配信の広告サービス「Google
            AdSense」を利用しています。このような広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他サイトへのアクセスに関する情報「Cookie」(氏名、住所、メールアドレス、電話番号は含まれません)
            を使用することがあります。
          </p>
          <p>
            Googleの広告におけるCookieの利用詳細については、以下をご確認ください。
          </p>
          <ul className="list-disc pl-6">
            <li>
              <Link
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-secondary"
              >
                Googleの広告とプライバシーに関するポリシー
              </Link>
            </li>
          </ul>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">4. アフィリエイトプログラム</h2>
          <p>当サイトは、様々なアフィリエイトプログラムに参加しています。</p>
          <p>
            第三者がコンテンツおよび宣伝を提供し、訪問者から直接情報を収集し、訪問者のブラウザにCookieを設定したりこれを認識したりする場合があります。これらのCookieは、アフィリエイトリンクを経由して商品が購入された際に、紹介料の支払いを正確に行うなどの目的で使用されます。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">5. Cookieの管理・無効化</h2>
          <p>
            お客様はご自身のブラウザ設定を変更することにより、Cookieの受け入れを拒否したり、Cookieが送信された際に警告を表示させたりすることができます。ただし、Cookieを無効にした場合、当サイトの一部機能が正常に動作しない可能性がありますのでご注意ください。
          </p>
          <p>主要なブラウザの設定方法は以下の通りです：</p>
          <ul className="list-disc pl-6">
            <li>
              <Link
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-secondary"
              >
                Google Chrome
              </Link>
            </li>
            <li>
              <Link
                href="https://support.mozilla.org/ja/kb/block-websites-storing-cookies-site-data-firefox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-secondary"
              >
                Mozilla Firefox
              </Link>
            </li>
            <li>
              <Link
                href="https://support.apple.com/ja-jp/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-secondary"
              >
                Apple Safari
              </Link>
            </li>
            <li>
              <Link
                href="https://support.microsoft.com/ja-jp/microsoft-edge/microsoft-edge-%E3%81%A7-cookie-%E3%82%92%E5%89%8A%E9%99%A4%E3%81%99%E3%82%8B-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-secondary"
              >
                Microsoft Edge
              </Link>
            </li>
          </ul>

          <h3 className="text-xl font-bold mt-6">
            Google Analyticsのオプトアウト
          </h3>
          <p>
            Google
            Analyticsによるデータ収集を無効にしたい場合は、Google社が提供する「Google
            Analyticsオプトアウトアドオン」をご利用ください。
          </p>
          <ul className="list-disc pl-6">
            <li>
              <Link
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-secondary"
              >
                Google Analyticsオプトアウトアドオン
              </Link>
            </li>
          </ul>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">6. クッキーポリシーの変更</h2>
          <p>
            当サイトは、法令の変更やサービスの改善に伴い、本クッキーポリシーを事前の予告なく変更することがあります。最新の内容は、常に本ページにてご確認いただけます。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">7. お問い合わせ</h2>
          <p>
            本クッキーポリシーに関するお問い合わせは、
            <Link
              href="/contact"
              className="text-primary underline hover:text-secondary"
            >
              お問い合わせフォーム
            </Link>
            よりご連絡ください。
          </p>

          <Separator className="my-8" />

          <p className="text-sm text-muted-foreground">
            最終更新日：2025年12月22日
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
