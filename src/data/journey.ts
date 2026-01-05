export interface JourneyItem {
  id: string;
  date: string; // "YYYY.MM" or "YYYY"
  title: string;
  location: string;
  description: string;
  image?: string;
  tags?: string[];
  link?: string;
}

export const JOURNEY_DATA: JourneyItem[] = [
  {
    id: "j-2023-10",
    date: "2023.10",
    title: "古都の魅力に触れる旅",
    location: "Kyoto, Japan",
    description:
      "紅葉が始まる前の静かな京都を散策。歴史ある寺院と、路地裏の小さなカフェ巡り。",
    tags: ["Solo", "Culture"],
    // image: "/images/Japan/kyoto.jpg", // Placeholder
  },
  {
    id: "j-2023-05",
    date: "2023.05",
    title: "アジアの熱気を感じて",
    location: "Bangkok, Thailand",
    description:
      "活気あふれるナイトマーケットと、荘厳な寺院のコントラスト。スパイスの効いた料理に舌鼓。",
    tags: ["Food", "Adventure"],
  },
  {
    id: "j-2022-12",
    date: "2022.12",
    title: "冬のヨーロッパ周遊",
    location: "Germany & Austria",
    description:
      "クリスマスマーケットの煌びやかな光と、温かいグリューワイン。雪景色の街並み。",
    tags: ["Friends", "Winter"],
  },
  {
    id: "j-2022-08",
    date: "2022.08",
    title: "南の島でリフレッシュ",
    location: "Okinawa, Japan",
    description:
      "透き通る青い海と白い砂浜。時間を忘れてただ波音を聞く、贅沢なひととき。",
    tags: ["Relax", "Nature"],
  },
];
