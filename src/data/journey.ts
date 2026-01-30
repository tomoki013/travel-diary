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
    id: "j-2024-02-26",
    date: "2024.02.26~02.28",
    title: "北海道の食を堪能する旅",
    location: "Hokkaido, Japan",
    description: "北海道の美味しい食べ物を堪能する旅。",
    tags: ["Couple", "Food"],
    image: "/images/Hokkaido/seafood-bowl.jpg",
  },
  {
    id: "j-2024-03-01",
    date: "2024.03.01~03.04",
    title: "アジアの熱気を感じて",
    location: "Bangkok, Thailand",
    description:
      "活気あふれるナイトマーケットと、荘厳な寺院のコントラスト。スパイスの効いた料理に舌鼓。",
    tags: ["Food", "Adventure"],
    image: "/images/Thai/wat-arun-right-up.jpg",
  },
  {
    id: "j-2024-09-21",
    date: "2024.09.21~09.30",
    title: "インド 混沌と祈りの旅",
    location: "New Delhi, Agra, Jaipur, Varanasi",
    description:
      "ニューデリーの喧騒、タージマハルの白亜の美しさ、そしてガンジス川の祈り。人生観を揺さぶる体験。",
    tags: ["Culture", "History", "Adventure"],
    image: "/images/India/tajmahal.jpg",
  },
  {
    id: "j-2025-02-13",
    date: "2025.02.13~02.28",
    title: "西欧 芸術と美食の周遊",
    location: "Paris, Barcelona, Madrid, Toledo, Brussels",
    description:
      "エッフェル塔の下でピクニック、サグラダ・ファミリアの荘厳さ、本場のパエリアとチョコレート。感性を磨く旅。",
    tags: ["Art", "Food", "City"],
    image: "/images/Spain/toledo-view.jpg",
  },
  {
    id: "j-2025-06-10",
    date: "2025.06.10~06.30",
    title: "大陸横断 古代文明を巡る冒険",
    location: "Bangkok to Santorini",
    description:
      "バンコクからイスタンブール、カッパドキアの奇岩、エジプトのピラミッド、そしてサントリーニ島の夕日。壮大なスケールの旅。",
    tags: ["Adventure", "History", "Nature", "Ocean"],
    image: "/images/Turkey/balloons-in-cappadocia.jpg",
  },
  {
    id: "j-2025-11-29",
    date: "2025.11.29~12.02",
    title: "上海 新旧が交錯する魔都",
    location: "Shanghai, China",
    description:
      "外灘の歴史的建築群と浦東の近未来的なスカイライン。小籠包の湯気と夜景に酔いしれる。",
    tags: ["City", "Food", "History"],
    image: "/images/China/shanghai.jpg",
  },
];

export const getJourneyById = (id: string): JourneyItem | undefined => {
  return JOURNEY_DATA.find((journey) => journey.id === id);
};
