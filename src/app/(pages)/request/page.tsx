import { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "記事テーマ リクエストボックス",
  description:
    "あなたの「知りたい」「見てみたい」を教えてください。tomokichidiaryで扱う記事のテーマを募集しています。あなたの声が次の冒険のテーマになるかもしれません。",
  robots: {
    index: false,
    follow: true,
  },
};

const Request = () => {
  return <Client />;
};

export default Request;
