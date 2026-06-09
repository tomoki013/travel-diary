import { Reveal } from "@/components/common/Reveal";
import { Lightbulb, CheckCircle, FileText } from "lucide-react";

export default function Client() {
  return (
    <div>
      {/* ==================== Hero Section ==================== */}
      <section className="text-foreground relative flex h-72 items-center justify-center text-center md:h-96">
        <div className="relative z-10 p-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            記事テーマ リクエストボックス
          </h1>
          <p className="text-md mx-auto mt-4 max-w-2xl md:text-lg">
            あなたの「知りたい！」「見てみたい」を教えてください。
            <br />
            次の冒険のテーマになるかもしれません。
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        {/* ==================== 挨拶・趣旨説明 ==================== */}
        <Reveal as="section" className="text-center">
          <h2 className="mb-4 text-3xl font-bold">このページについて</h2>
          <p className="text-foreground text-lg leading-relaxed">
            いつもブログを読んでくださりありがとうございます！
            <br />
            このブログを、もっと皆さんの役に立つ場所にしたいと思い、記事のテーマを募集するページを作りました。
            <br />
            あなたの素朴な疑問や知りたいことが、他の誰かの助けになるかもしれません。お気軽に投稿してくださいね。
          </p>
        </Reveal>

        {/* ==================== 募集テーマの例 ==================== */}
        <Reveal as="section">
          <h2 className="mb-8 text-center text-3xl font-bold">
            例えば、こんなテーマを募集しています
          </h2>
          <div className="grid gap-6 text-gray-700 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-6">
              <Lightbulb className="mt-1 h-8 w-8 flex-shrink-0 text-amber-500" />
              <div>
                <h3 className="mb-1 font-bold">素朴な疑問</h3>
                <p>旅行計画に関する素朴な疑問（例：航空券の探し方、ホテルの選び方）</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-6">
              <CheckCircle className="mt-1 h-8 w-8 flex-shrink-0 text-teal-500" />
              <div>
                <h3 className="mb-1 font-bold">レビュー依頼</h3>
                <p>レビューしてほしい旅行グッズやカメラ機材</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-6">
              <FileText className="mt-1 h-8 w-8 flex-shrink-0 text-blue-500" />
              <div>
                <h3 className="mb-1 font-bold">深掘り解説</h3>
                <p>詳しく解説してほしい国や地域の歴史・文化</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-6">
              <FileText className="mt-1 h-8 w-8 flex-shrink-0 text-purple-500" />
              <div>
                <h3 className="mb-1 font-bold">体験談</h3>
                <p>僕の体験談（失敗談・成功談など）で聞いてみたいこと</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ==================== 投稿フォーム ==================== */}
        <Reveal as="section">
          <h2 className="mb-8 text-center text-3xl font-bold">リクエストフォーム</h2>
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-8 text-center">
            <div className="rounded-lg bg-gray-100 p-2 shadow-inner">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSfpawRugp4nrxhGMR-YBEFHn3ZYqrVpP_sLXCteNneYh9higg/viewform?embedded=true"
                width="100%"
                height="520"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
              >
                読み込んでいます…
              </iframe>
            </div>
            <p className="mt-2 text-gray-500">皆さんの声をお待ちしております！</p>
          </div>
        </Reveal>

        {/* ==================== 注意事項 ==================== */}
        <Reveal as="section" className="rounded-lg bg-gray-50 p-6 text-sm text-gray-600">
          <h3 className="mb-4 text-center text-lg font-bold">注意事項</h3>
          <ul className="list-inside list-disc space-y-2">
            <li>いただいたテーマ全てを記事にできるわけではありません。ご了承ください。</li>
            <li>
              原則として、投稿への個別の返信は行っておりません。（採用時に連絡をご希望の方は、フォームにメールアドレスをご記入ください）
            </li>
            <li>
              採用させていただく際に、テーマの意図を汲み取り、表現を一部変更する場合があります。
            </li>
            <li>個人情報や、他人を傷つけるような内容はご遠慮ください。</li>
          </ul>
        </Reveal>

        {/* ==================== 締めのメッセージ ==================== */}
        <Reveal as="section" amount={0.3} className="text-center">
          <p className="text-foreground text-xl font-semibold">
            あなたの声が、このブログの未来を作ります。
            <br />
            お気軽に投稿いただけると嬉しいです！
          </p>
        </Reveal>
      </div>
    </div>
  );
}
