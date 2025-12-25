import Link from "next/link";

// これがないとオフライン用キャッシュに含まれないことがあるので必須
export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">現在オフラインです</h1>
      <p className="mb-8">
        インターネット接続を確認してください。
        <br />
        一度訪れたページは、オフラインでも閲覧できる場合があります。
      </p>
      <Link
        href="/"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        トップページに戻る
      </Link>
    </div>
  );
}
