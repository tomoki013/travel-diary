import { regionData } from "@/data/region";
import Client from "./Client";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "地域別一覧",
  description: "地域別に記事を探すことができます。",
  path: "/destination",
});

export default function Page() {
  // 以前はここにあったグルーピング処理が不要になる
  return <Client regionData={regionData} />;
}
