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
          {
            slug: "osaka",
            name: "大阪",
            imageURL: "/images/Osaka/kansai-airport.jpg",
          },
          {
            slug: "hokkaido",
            name: "北海道",
            imageURL: "/images/Hokkaido/otaru-canal.jpg",
          },
        ],
      },
      {
        slug: "south-korea",
        name: "韓国",
        imageURL: "/images/Korea/monument.jpg",
        children: [
          {
            slug: "seoul",
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
        description: "微笑みの国タイ。活気あふれるバンコクの寺院巡りから、美味しい屋台グルメ、美しいビーチまで、多彩な魅力が詰まった人気の旅行先です。",
        children: [
          {
            slug: "bangkok",
            name: "バンコク",
            imageURL: "/images/Thai/ceiling-at-wat-pak-nam.jpg",
            description: "タイの首都バンコク。三大寺院などの歴史的建造物と、近代的なショッピングモール、熱気あふれるマーケットが共存するエネルギッシュな都市です。",
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
        imageURL: "/images/China/shanghai-airport-food.jpg",
        children: [
          {
            slug: "shanghai",
            name: "上海",
            imageURL: "/images/China/shanghai-airport-food.jpg",
          },
        ],
      },
      {
        slug: "malaysia",
        name: "マレーシア",
        imageURL: "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
        children: [
          {
            slug: "kuala-lumpur",
            name: "クアラルンプール",
            imageURL: "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
          },
          {
            slug: "putrajaya",
            name: "プトラジャヤ",
            imageURL: "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
          },
        ],
      },
      {
        slug: "singapore",
        name: "シンガポール",
        imageURL:
          "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
        children: [
          {
            slug: "singapore-city",
            name: "シンガポール市内",
            imageURL:
              "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
          },
          {
            slug: "sentosa",
            name: "セントーサ島",
            imageURL:
              "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
          },
          {
            slug: "changi",
            name: "チャンギ",
            imageURL:
              "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
          },
        ],
      },
      {
        slug: "indonesia",
        name: "インドネシア",
        imageURL: "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
        children: [
          {
            slug: "seminyak",
            name: "スミニャック",
            imageURL:
              "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
          },
          {
            slug: "yogyakarta",
            name: "ジョグジャカルタ",
            imageURL:
              "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
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
        description: "芸術と美食の国フランス。華やかなパリの街並みや世界遺産のモン・サン・ミッシェルなど、一度は訪れたい憧れのスポットが満載です。",
        children: [
          {
            slug: "paris",
            name: "パリ",
            imageURL: "/images/France/louvre-museum1.jpg",
            description: "花の都パリ。エッフェル塔やルーブル美術館などのランドマークに加え、お洒落なカフェやブティックが並ぶ、世界中から愛される都市です。",
          },
        ],
      },
      {
        slug: "spain",
        name: "スペイン",
        imageURL: "/images/Spain/las-ventas-bullring.jpg",
        description: "情熱の国スペイン。ガウディの建築美に触れるバルセロナや、歴史あるマドリード、絶景の古都トレドなど、地域ごとに異なる魅力が楽しめます。",
        children: [
          {
            slug: "barcelona",
            name: "バルセロナ",
            imageURL: "/images/Spain/sagrada-familia.jpg",
            description: "地中海に面した芸術都市バルセロナ。サグラダ・ファミリアをはじめとするガウディの名建築巡りや、美味しいタパスを楽しめます。",
          },
          {
            slug: "madrid",
            name: "マドリード",
            imageURL: "/images/Spain/plaza-de-mayor.jpg",
            description: "スペインの首都マドリード。王宮やプラド美術館などの文化施設に加え、活気ある市場や広場で現地の生活を感じることができます。",
          },
          {
            slug: "toledo",
            name: "トレド",
            imageURL: "/images/Spain/toledo-view.jpg",
            description: "「16世紀で歩みが止まった街」と称される世界遺産の古都。迷路のような路地や、展望台からの荘厳なパノラマは必見です。",
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
