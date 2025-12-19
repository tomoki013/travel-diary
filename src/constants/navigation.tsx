import { FaGithub, FaPenSquare, FaTiktok, FaYoutube } from "react-icons/fa";

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
  {
    name: "AI旅行プランナー",
    pass: "/ai-planner",
    isNew: true,
    target: "_blank",
  },
  {
    name: "Tomokichi Globe",
    pass: "https://travel.tomokichidiary.com/map",
    isNew: true,
    target: "_blank",
  },
  { name: "地域別一覧", pass: "/destination" },
  { name: "シリーズ一覧", pass: "/series" },
  { name: "ブログ一覧", pass: "/posts" },
  { name: "写真ギャラリー", pass: "/gallery" },
];

export const FOOTER_ABOUT_LIST: FooterContent[] = [
  { name: "サイトについて", pass: "/about" },
  { name: "FAQ", pass: "/faq" },
  { name: "ロードマップ", pass: "/roadmap" },
  {
    name: "サイトステータス",
    pass: "https://status.tomokichidiary.com",
    target: "_blank",
  },
  { name: "サイトマップ", pass: "/sitemap" },
];

export const FOOTER_COMMUNITY_LIST: FooterContent[] = [
  { name: "お問い合わせ", pass: "/contact" },
  { name: "記事テーマ募集", pass: "/request" },
  { name: "SNS", pass: "/social" },
];

export const FOOTER_LEGAL_LIST: FooterContent[] = [
  { name: "プライバシーポリシー", pass: "/privacy" },
  { name: "利用規約", pass: "/terms" },
  { name: "アフィリエイトポリシー", pass: "/affiliates" },
];

export const SOCIAL_LIST = [
  {
    name: "YouTube",
    pass: "https://www.youtube.com/@tomokichi_travel",
    icon: <FaYoutube />,
  },
  {
    name: "TikTok",
    pass: "https://www.tiktok.com/@tomokichitravel",
    icon: <FaTiktok />,
  },
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
];
