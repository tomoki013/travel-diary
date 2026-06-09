import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
import { FaYoutube, FaTiktok, FaGithub, FaPenNib, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiZenn, SiQiita } from "react-icons/si";
import { ConnpassIcon } from "@/components/common/icons/ConnpassIcon";
import HeroSection from "@/components/pages/HeroSection";

// --- Data ---
const socialAccounts = [
  {
    name: "YouTube",
    url: "https://www.youtube.com/@tomokichi_travel",
    IconComponent: FaYoutube,
    iconColor: "text-red-600",
    conceptTitle: "旅の没入体験",
    description:
      "旅先の風景や空気感を、Vlog形式でお届けします。映像と音で、まるでその場にいるかのような体験をお楽しみください。長めの動画で旅のストーリーをじっくり追体験したい方におすすめです。",
    ctaText: "YouTubeでチャンネル登録する",
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@tomokichitravel",
    IconComponent: FaTiktok,
    iconColor: "text-black",
    conceptTitle: "旅の「一口」情報",
    description:
      "旅先で見つけたグルメや、あまり知られていない絶景スポットを30秒程度のショート動画で紹介しています。次の旅行先を探すヒントや、すきま時間での情報収集に最適です。",
    ctaText: "TikTokでフォローする",
  },
  {
    name: "note",
    url: "https://note.com/tomokichidiary",
    IconComponent: FaPenNib,
    iconColor: "text-teal-600",
    conceptTitle: "旅の記録とエッセイ",
    description:
      "旅先での出来事や感じたことを、文章でじっくり綴っています。訪れた場所の歴史や文化、現地の人々との交流、旅を通じて考えたことなど、テキストベースで深掘りした記事を投稿しています。写真や動画では伝えきれない、旅の本質的な魅力をお届けします。",
    ctaText: "noteでフォローする",
  },
  {
    name: "GitHub",
    url: "https://github.com/tomoki013/new-travelblog",
    IconComponent: FaGithub,
    iconColor: "text-gray-800",
    conceptTitle: "ブログの裏側",
    description:
      "このブログサイト（tomokichidiary）のソースコードを公開しています。Next.jsやWeb制作の技術的な側面に興味がある方向けです。サイトの改善提案やコントリビュートもお待ちしています。",
    ctaText: "GitHubでコードを見る",
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/tomokichi178694",
    IconComponent: FaXTwitter,
    iconColor: "text-black",
    conceptTitle: "日々のつぶやき・最新情報",
    description:
      "ブログの更新情報や、開発の進捗、日常のちょっとした気づきなどをリアルタイムで発信しています。気軽に交流できる場として活用しています。",
    ctaText: "Xでフォローする",
  },
  {
    name: "Qiita",
    url: "https://qiita.com/tomokichidiary",
    IconComponent: SiQiita,
    iconColor: "text-green-500",
    conceptTitle: "技術的なTipsと知見",
    description:
      "Web開発で得た技術的な知見やTips、つまづいたポイントとその解決策などを記事としてまとめています。同じ技術スタックを学ぶ方の参考になれば幸いです。",
    ctaText: "Qiitaで記事を読む",
  },
  {
    name: "Zenn",
    url: "https://zenn.dev/tomoki013",
    IconComponent: SiZenn,
    iconColor: "text-blue-500",
    conceptTitle: "技術記事・考察",
    description:
      "フロントエンド技術を中心とした、より体系的な技術記事や、開発に関する深い考察を発信しています。",
    ctaText: "Zennで記事を読む",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/tomoki-takagi-5b08a738b",
    IconComponent: FaLinkedin,
    iconColor: "text-blue-700",
    conceptTitle: "プロフェッショナルネットワーク",
    description:
      "職務経歴やスキルセット、これまでのプロジェクト経験を公開しています。ビジネスや技術的な繋がり、キャリアに関するご相談はこちらからお願いします。",
    ctaText: "LinkedInで繋がる",
  },
  {
    name: "connpass",
    url: "https://connpass.com/user/tomoki013/",
    IconComponent: ConnpassIcon,
    iconColor: "text-red-700",
    conceptTitle: "IT勉強会・イベント参加",
    description:
      "参加した、または登壇したIT勉強会や技術イベントの記録です。オフライン・オンライン問わず、技術コミュニティでの活動履歴を確認できます。",
    ctaText: "connpassを見る",
  },
];

export default function Client() {
  return (
    <div>
      {/* ==================== Hero Section ==================== */}
      <HeroSection
        src="/images/Introduce/introduce.jpg"
        alt="Social Media Hero Image"
        pageTitle="Follow Me"
        pageMessage="各SNSの活動内容やコンセプトをご紹介します"
      />

      <div className="mx-auto max-w-4xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        {/* ==================== SNS Cards List ==================== */}
        {socialAccounts.map((account) => (
          <Reveal
            as="section"
            key={account.name}
            amount={0.3}
            className="rounded-lg bg-gray-50 p-8 shadow-md"
          >
            <div className="mb-6 flex items-center gap-4">
              <account.IconComponent className={`text-5xl ${account.iconColor}`} />
              <h2 className="text-4xl font-bold">{account.name}</h2>
            </div>

            <div className="pl-2">
              <h3 className="mb-2 text-xl font-semibold text-teal-600">{account.conceptTitle}</h3>
              <p className="mb-6 leading-relaxed text-gray-700">{account.description}</p>

              <Link
                href={account.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-full bg-gray-800 px-8 py-3 font-bold text-white transition-colors hover:bg-gray-700"
              >
                {account.ctaText} →
              </Link>
            </div>
          </Reveal>
        ))}

        {/* ==================== 締めのメッセージ ==================== */}
        <Reveal as="section" amount={0.3} className="py-10 text-center">
          <p className="text-xl font-semibold text-gray-800">
            お好きなプラットフォームで、お気軽にフォローしてください！
            <br />
            あなたのフォローが、活動の大きな励みになります。
          </p>
        </Reveal>
      </div>
    </div>
  );
}
