import { FaGithub, FaPenSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export interface NavLink {
  href: string;
  label: string;
  isNew?: boolean;
}

export interface FooterContent {
  name: string;
  pass: string;
  isNew?: boolean;
  target?: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/destination", label: "Destination" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

export const FOOTER_CONTENTS_LIST: FooterContent[] = [
  { name: "ブログ一覧", pass: "/posts" },
  { name: "写真ギャラリー", pass: "/gallery" },
  { name: "地域別一覧", pass: "/destination" },
  { name: "シリーズ一覧", pass: "/series" },
  { name: "旅の軌跡", pass: "/journey" },
];

export const FOOTER_ABOUT_LIST: FooterContent[] = [
  { name: "サイトについて", pass: "/about" },
  { name: "更新履歴", pass: "/roadmap#updates" },
  { name: "サイトマップ", pass: "/sitemap" },
];

export const FOOTER_COMMUNITY_LIST: FooterContent[] = [
  { name: "FAQ", pass: "/faq" },
  { name: "お問い合わせ", pass: "/contact" },
  // { name: "機能要望・バグ報告", pass: "/feedback" },
  { name: "記事テーマ募集", pass: "/request" },
];

export const FOOTER_LEGAL_LIST: FooterContent[] = [
  { name: "プライバシーポリシー", pass: "/privacy" },
  { name: "利用規約", pass: "/terms" },
  { name: "アフィリエイトポリシー", pass: "/affiliates" },
  { name: "執筆・編集ポリシー", pass: "/editorial-policy" },
  { name: "クッキーポリシー", pass: "/cookie-policy" },
];

export const SOCIAL_LIST = [
  {
    name: "note",
    pass: "https://note.com/tomokichidiary",
    icon: <FaPenSquare />,
  },
  {
    name: "GitHub",
    pass: "https://github.com/tomoki013/new-travelblog",
    icon: <FaGithub />,
  },
  {
    name: "X",
    pass: "https://x.com/tomokichi178694",
    icon: <FaXTwitter />,
  },
];
