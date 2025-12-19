import { ContinentData } from "@/types/types";

export const regionData: ContinentData[] = [
  {
    slug: "asia",
    name: "アジア",
    countries: [
      {
        slug: "japan",
        name: "日本",
        imageURL: "/images/Kyoto/kiyomizu-temple-autumn-leaves-lightup.jpg",
        children: [
          {
            slug: "kyoto",
            name: "京都",
            imageURL: "/images/Kyoto/kiyomizu-temple-autumn-leaves-lightup.jpg",
          },
          { slug: "osaka", name: "大阪", imageURL: "/images/Osaka/" },
          {
            slug: "hokkaido",
            name: "北海道",
            imageURL: "/images/Hokkaido/otaru-canal.jpg",
          },
        ],
      },
      {
        slug: "south korea",
        name: "韓国",
        imageURL: "/images/Korea/monument.jpg",
        children: [
          {
            slug: "soul",
            name: "ソウル",
            imageURL: "/images/Korea/monument.jpg",
          },
        ],
      },
      {
        slug: "india",
        name: "インド",
        imageURL: "/images/India/tajmahal.jpg",
        children: [
          {
            slug: "new-delhi",
            name: "ニューデリー",
            imageURL: "/images/India/indian-gate-at-noon.jpg",
          },
          {
            slug: "agra",
            name: "アグラ",
            imageURL: "/images/India/tajmahal.jpg",
          },
          {
            slug: "jaipur",
            name: "ジャイプル",
            imageURL: "/images/India/hawa-mahal.jpg",
          },
          {
            slug: "varanasi",
            name: "バラナシ",
            imageURL: "/images/India/festival-of-ganga3.jpg",
          },
        ],
      },
      {
        slug: "thailand",
        name: "タイ",
        imageURL: "/images/Thai/emotional-wat-arun.jpg",
        children: [
          {
            slug: "bangkok",
            name: "バンコク",
            imageURL: "/images/Thai/ceiling-at-wat-pak-nam.jpg",
          },
        ],
      },
      {
        slug: "vietnam",
        name: "ベトナム",
        imageURL: "/images/Vietnam/vietnam-old-town2.jpg",
        children: [
          {
            slug: "hanoi",
            name: "ハノイ",
            imageURL: "/images/Vietnam/vietnam-old-town2.jpg",
          },
        ],
      },
      {
        slug: "china",
        name: "中国",
        imageURL: "/images/China/shanghai.jpg",
        children: [
          {
            slug: "shanghai",
            name: "上海",
            imageURL: "/images/China/shanghai.jpg",
          },
        ],
      },
    ],
  },
  {
    slug: "europe",
    name: "ヨーロッパ",
    countries: [
      {
        slug: "france",
        name: "フランス",
        imageURL: "/images/France/eiffel-tower-and-sunset.jpg",
        children: [
          {
            slug: "paris",
            name: "パリ",
            imageURL: "/images/France/louvre-museum1.jpg",
          },
        ],
      },
      {
        slug: "spain",
        name: "スペイン",
        imageURL: "/images/Spain/las-ventas-bullring.jpg",
        children: [
          {
            slug: "barcelona",
            name: "バルセロナ",
            imageURL: "/images/Spain/sagrada-familia.jpg",
          },
          {
            slug: "madrid",
            name: "マドリード",
            imageURL: "/images/Spain/plaza-de-mayor.jpg",
          },
          {
            slug: "toledo",
            name: "トレド",
            imageURL: "/images/Spain/toledo-view.jpg",
          },
        ],
      },
      {
        slug: "belgium",
        name: "ベルギー",
        imageURL: "/images/Belgium/galeries-royales-saint-hubert.jpg",
        children: [
          {
            slug: "brussels",
            name: "ブリュッセル",
            imageURL: "/images/Belgium/galeries-royales-saint-hubert.jpg",
          },
        ],
      },
      {
        slug: "greece",
        name: "ギリシャ",
        imageURL: "/images/Greece/oia-castle-sunset-view.jpg",
        children: [
          {
            slug: "santorini",
            name: "サントリーニ",
            imageURL: "/images/Greece/santorini-view.jpg",
          },
          {
            slug: "athens",
            name: "アテネ",
            imageURL: "/images/Greece/parthenon.jpg",
          },
        ],
      },
      {
        slug: "turkey",
        name: "トルコ",
        imageURL: "/images/Turkey/balloons-in-cappadocia.jpg",
        children: [
          {
            slug: "cappadocia",
            name: "カッパドキア",
            imageURL: "/images/Turkey/balloons-in-cappadocia.jpg",
          },
        ],
      },
    ],
  },
  {
    slug: "africa",
    name: "アフリカ",
    countries: [
      {
        slug: "egypt",
        name: "エジプト",
        imageURL:
          "/images/Egypt/the-three-great-pyramids-of-giza-with-sunset.jpg",
        children: [
          {
            slug: "cairo",
            name: "カイロ",
            imageURL:
              "/images/Egypt/the-three-great-pyramids-of-giza-with-sunset.jpg",
          },
          {
            slug: "giza",
            name: "ギザ",
            imageURL:
              "/images/Egypt/the-three-great-pyramids-of-giza-with-sunset.jpg",
          },
          {
            slug: "abu-simbel",
            name: "アブシンベル",
            imageURL: "/images/Egypt/abusimbel-temple.jpg",
          },
          {
            slug: "aswan",
            name: "アスワン",
            imageURL: "/images/Egypt/aswan-view.jpg",
          },
        ],
      },
    ],
  },
];
