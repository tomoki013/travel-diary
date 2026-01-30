export type PostType = "tourism" | "itinerary" | "series" | "one-off";
export interface Post {
  slug: string;
  title: string;
  dates: string[];
  content: string;
  category: string;
  id?: string;
  excerpt?: string;
  image?: string;
  tags?: string[];
  location?: string[];
  author?: string;
  budget?: number;
  costs?: Record<string, number>;
  series?: string;
  isPromotion?: boolean;
  promotionPG?: string[];
  journey?: string;
}

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
}

export interface Country {
  slug: string;
  name: string;
  imageURL: string;
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
