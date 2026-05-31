// 記事カテゴリの型。tourism=観光実用情報, itinerary=旅程費用まとめ, series=連載, one-off=エッセイ
export type PostType = "tourism" | "itinerary" | "series" | "one-off";

// 実用情報ラベルの型。category: tourism の記事にのみ付与する
export type TravelTopic = "money" | "visa" | "transport" | "booking" | "sim" | "insurance";

// 収益カテゴリの型。フロントマターには書かず revenue.ts が推論で算出する内部専用
export type RevenueCategory = TravelTopic | "guide" | "essay";

export interface Post {
  // ファイル名から自動生成されるスラッグ（小文字ケバブケース）
  slug: string;
  // 記事タイトル（必須）
  title: string;
  // Markdown 本文（フロントマターではなくファイル本体）
  content: string;
  // ビルド時に抽出した H2/H3 見出し一覧（目次生成に使う）
  headings?: { id: string; text: string; level: number }[];

  // 公開日（必須）：旅行実施日またはコンテンツ基準日を YYYY-MM-DD で
  publishedAt: string;
  // 更新日（任意）：内容を大幅改訂した日
  updatedAt?: string;
  // 旅行期間（任意）：start は必須、end は複数日の場合のみ
  travelDates?: { start: string; end?: string };

  // カテゴリ（必須）：PostType の4種類から1つ
  category: PostType;
  // SEO 専用の短い説明文（任意）：省略時は excerpt が代わりに使われる
  description?: string;
  // 一覧カード・Introduction セクションに表示する要約（任意）
  excerpt?: string;
  // 検索・フリーワード導線用タグ（任意）
  tags?: string[];

  // アイキャッチ画像のパス（任意）：/images/ から始まる相対パス
  heroImage?: string;
  // アイキャッチ画像の alt テキスト（任意）：省略時はタイトルが使われる
  heroAlt?: string;

  // 地域スラッグ配列（任意）：src/data/region.ts の slug と一致させる
  regionIds?: string[];
  // 著者名（任意）：省略時は「ともきち」として扱う
  author?: string;

  // 連載シリーズ情報（任意）：category: series の場合に必須
  // slug は src/data/series.ts の slug、order は省略可（publishedAt 順で並ぶ）
  series?: { slug: string; order?: number };
  // 旅程 ID（任意）：src/data/journey.ts の ID と一致させる
  journeyId?: string;

  // 費用レポート（任意）：category: itinerary でのみ使う
  // budget は事前想定予算、costs は実際の支出内訳
  costReport?: {
    budget?: { amount: number; currency: string };
    costs?: { currency: string; items: Record<string, number> };
  };

  // プロモーションプログラム（任意）：PR 記事の場合のみ設定する
  // 空配列または undefined のときは通常記事として扱う
  promotionPrograms?: string[];

  // 実用情報ラベル（任意）：category: tourism の記事にのみ付与する
  travelTopics?: TravelTopic[];
  // 下書きフラグ（任意）：true のままだとビルドのメタデータに含まれない
  draft?: boolean;
}

// ページ遷移・一覧表示など本文不要な場面で使う軽量型
export type PostMetadata = Omit<Post, "content">;

export interface Photo {
  id: string;
  path: string;
  title: string;
  description: string;
  location: string;
  categories: string[];
  likes?: number;
}

export interface Author {
  name: string;
  role: string;
  description: string;
  image: string;
}

// --- Region Types ---

export interface City {
  slug: string;
  name: string;
  imageURL: string;
  description?: string;
}

export interface Country {
  slug: string;
  name: string;
  imageURL: string;
  description?: string;
  children?: City[];
}

export interface ContinentData {
  slug: string;
  name: string;
  countries: Country[];
}

export interface Region {
  slug: string;
  name: string;
  imageURL: string;
  description?: string;
  children?: Region[];
}

// Seriesデータの型定義
export interface Series {
  id: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  IconComponent: string;
}

export interface AllDestinationProps {
  regionData: ContinentData[];
}

// アフィリエイトプログラムの型定義
export interface AffiliatesProps {
  name: string;
  affiliateUrl: string;
  homeUrl: string;
  image?: string;
  type: "link" | "card" | "banner";
  icon?: React.ReactNode;
  description: string;
  status: string;
  bannerHtml?: string;
  categories?: string[];
}

// --- AI Planner Types ---

export interface TravelPlan {
  itinerary: {
    title: string;
    description: string;
    totalBudget: number;
    days: {
      day: number;
      title: string;
      budget: number;
      schedule: {
        time: string;
        activity: string;
        details: string;
        cost: number;
        location: {
          name: string;
          latitude: number;
          longitude: number;
        };
      }[];
    }[];
  };
  budgetSummary: {
    total: number;
    categories: {
      category: string;
      amount: number;
    }[];
  };
}
