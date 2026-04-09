import { regionData } from "@/data/region";
import Client from "./Client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "地域別一覧",
  description: "地域別に記事を探すことができます。",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  // 以前はここにあったグルーピング処理が不要になる
  return <Client regionData={regionData} />;
}
