import { 
  Rocket, 
  MapPin, 
  Globe, 
  Languages, 
  Laptop, 
  Search, 
  Layout, 
  Wifi, 
  Cpu, 
  Users, 
  Share2, 
  Database,
  History
} from "lucide-react";

export interface RoadmapItem {
  id: string;
  season: string;
  title: string;
  description: string;
  status: "COMPLETED" | "DEPLOYED" | "CURRENT_TARGET" | "PENDING" | "CONCEPT";
  icon: React.ReactNode;
}

export const ROADMAP_DATA: RoadmapItem[] = [
  {
    id: "genesis",
    season: "2024.Q3",
    title: "旅の原点：Genesis",
    description:
      "初代「ともきちの旅行ブログ」がHTML/CSS/JSで誕生。北海道やタイへの初海外旅行記を通じ、自らの体験を届ける活動がスタートしました。",
    status: "COMPLETED",
    icon: <History className="w-6 h-6" />,
  },
  {
    id: "next-gen-v2",
    season: "2024.Q4",
    title: "進化の離陸：V2 Launch",
    description:
      "2代目「ともきちの旅行日記」へと進化。Next.jsを採用し、より高速でモダンなデジタルな旅の拠点を構築しました。",
    status: "COMPLETED",
    icon: <Rocket className="w-6 h-6" />,
  },
  {
    id: "utility-v3",
    season: "2025.Q1",
    title: "多機能ポータル：Multi-Tool",
    description:
      "3代目公開。デザインを一新し、Galleryやダークモードに加え、計算ツールや世界時計等の便利機能を搭載。旅を支えるツールとしての側面を強化しました。",
    status: "COMPLETED",
    icon: <Layout className="w-6 h-6" />,
  },
  {
    id: "discovery",
    season: "2025.Q2",
    title: "冒険の発見：Search Engine",
    description:
      "過去の膨大な冒険（記事）の中から、読みたい情報をすぐに見つけ出せるサイト内検索機能を導入。ユーザーの利便性を大幅に向上させました。",
    status: "COMPLETED",
    icon: <Search className="w-6 h-6" />,
  },
  {
    id: "re-concept-v4",
    season: "2025.Q3",
    title: "感性の再定義：New Concept",
    description:
      "4代目公開。独自性のある視覚体験を提供するデザインへ刷新。D3.js地図の導入に加え、電波のない旅先でも閲覧できるオフライン対応を完了しました。",
    status: "COMPLETED",
    icon: <Wifi className="w-6 h-6" />,
  },
  {
    id: "ai-globe-v4-5",
    season: "2025.Q4",
    title: "知能と視覚：AI & Globe",
    description:
      "AI旅行プランナー（Beta）と3D地球儀「Tomokichi Globe」をリリース。サイトの健康状態を示すステータスページも公開し、信頼性を高めました。",
    status: "DEPLOYED",
    icon: <Globe className="w-6 h-6" />,
  },
  {
    id: "ai-autopilot",
    season: "2026.Q1",
    title: "自動操縦：AI Autopilot",
    description:
      "サイト運営の一部にAIを本格導入。最新情報の更新やデータ管理をAIがサポートすることで、クリエイティブな発信により注力できる体制へ。",
    status: "CURRENT_TARGET",
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    id: "community-hub",
    season: "2026.Q2",
    title: "共創の広場：Co-Creation",
    description:
      "記事テーマの公募やQ&Aセッションを本格始動。「ユーザーと共に作り上げるメディア」として、双方向のコミュニティを形成します。",
    status: "PENDING",
    icon: <Users className="w-6 h-6" />,
  },
  {
    id: "partnership-voyage",
    season: "2026.Q3",
    title: "境界なき旅：Partnership Voyage",
    description:
      "旅行会社やクリエイターとのコラボ企画を実施。一部記事の多言語化も開始し、世界中の旅人とワクワクを共有するステージへ。",
    status: "CONCEPT",
    icon: <Share2 className="w-6 h-6" />,
  },
  {
    id: "custom-cms",
    season: "2026.Q4",
    title: "次世代の記録法：Custom CMS",
    description:
      "Markdown管理から独自の記事投稿システムへ移行。メディアとしての発信スピードと表現力を最大化し、さらなる冒険へ備えます。",
    status: "CONCEPT",
    icon: <Database className="w-6 h-6" />,
  },
];