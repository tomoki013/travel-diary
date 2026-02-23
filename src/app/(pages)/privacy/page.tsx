import { Separator } from "@/components/ui/separator"; // 推奨されるインポートパス
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "ともきちの旅行日記のプライバシーポリシーです。個人情報の取り扱いやCookieの使用について詳しく説明しています。",
  openGraph: {
    title: "プライバシーポリシー",
    description:
      "ともきちの旅行日記のプライバシーポリシーです。個人情報の取り扱いやCookieの使用について詳しく説明しています。",
  },
  twitter: {
    title: "プライバシーポリシー",
    description:
      "ともきちの旅行日記のプライバシーポリシーです。個人情報の取り扱いやCookieの使用について詳しく説明しています。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const PrivacyPage = () => {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:mx-8">
        <h1 className="mb-8 text-4xl font-bold">プライバシーポリシー</h1>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p>
            当サイト「ともきちの旅行日記」（以下、「当サイト」）は、ユーザーの個人情報の保護を重要と考えています。本プライバシーポリシーでは、当サイトがどのように個人情報を収集、使用、保護するかについて説明します。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">1. 収集する情報</h2>
          <p>当サイトでは、以下の情報を収集する場合があります：</p>
          <ul className="list-disc pl-6">
            <li>
              お問い合わせフォームにご入力いただいた情報（お名前、メールアドレス、お問い合わせ内容）
            </li>
            <li>
              サーバーによって自動的に記録されるアクセスログ情報（IPアドレス、ブラウザの種類、リファラなど）
            </li>
            <li>
              Cookieを通じて収集される、個人を特定しない形でのサイト利用履歴
            </li>
          </ul>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">2. 情報の使用目的</h2>
          <p>収集した情報は、以下の目的で使用されます：</p>
          <ul className="list-disc pl-6">
            <li>お問い合わせ内容への回答および連絡</li>
            <li>サービスの安定的な提供と改善</li>
            <li>新機能や新しいコンテンツの開発の参考</li>
            <li>当サイトの利用状況の分析、およびマーケティング活動</li>
          </ul>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">3. 個人情報の保護</h2>
          <p>
            当サイトは、収集した個人情報の漏洩、紛失、改ざんなどを防ぐため、適切なセキュリティ対策を実施し、厳重に管理いたします。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">4. 第三者への提供</h2>
          <p>
            当サイトは、以下の場合を除き、収集した個人情報を第三者に提供することはありません：
          </p>
          <ul className="list-disc pl-6">
            <li>ユーザーご本人の同意がある場合</li>
            <li>法令に基づく開示請求があった場合</li>
            <li>
              人の生命、身体または財産の保護のために必要がある場合であって、ご本人の同意を得ることが困難であるとき
            </li>
          </ul>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold" id="cookie">
            5. Cookie（クッキー）の使用について
          </h2>
          <p>
            当サイトでは、サービスの向上、アクセス解析、および広告配信のためにCookieを使用しています。
            Cookieの具体的な使用目的、使用しているツール、および無効化の方法などの詳細については、
            <Link
              href="/cookie-policy"
              className="text-primary underline hover:text-secondary"
            >
              クッキーポリシー
            </Link>
            をご確認ください。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">
            6. アフィリエイトプログラムについて
          </h2>
          <p>当サイトは、アフィリエイトプログラム参加者です。</p>
          <p>
            第三者がコンテンツおよび宣伝を提供し、訪問者から直接情報を収集し、訪問者のブラウザにCookieを設定したりこれを認識したりする場合があります。
          </p>
          <p>
            詳しい運営方針は
            <Link
              href={`/affiliates`}
              className="text-primary underline hover:text-secondary"
            >
              アフィリエイトポリシー
            </Link>
            をご覧ください。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">7. 免責事項</h2>
          <p>
            当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。当サイトからリンクやバナーなどによって他のサイトに移動した場合、移動先サイトで提供される情報、サービス等についても一切の責任を負いません。
          </p>
          <p>
            当サイトで掲載しているコンテンツ・情報は、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。必ずしも正確性を保証するものではありません。また、合法性や安全性なども保証致しません。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">8. お問い合わせ</h2>
          <p>
            本プライバシーポリシーに関するお問い合わせは、
            <Link
              href="/contact"
              className="text-primary underline hover:text-secondary"
            >
              お問い合わせフォーム
            </Link>
            よりご連絡ください。
          </p>

          <Separator className="my-8" />

          <h2 className="text-2xl font-bold">9. プライバシーポリシーの変更</h2>
          <p>
            当サイトは、法令の変更やサービスの改善に伴い、本プライバシーポリシーを事前の予告なく変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載したときから効力を生じるものとします。
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

export default PrivacyPage;
