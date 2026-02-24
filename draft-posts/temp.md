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
