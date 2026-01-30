import { AffiliatesProps } from "@/types/types";
import { BedDouble, Home, Plane, Ticket, Train, Wifi } from "lucide-react";

// 表示するアプリのデータを定義します。
// name: サービス名
// affiliateUrl: アフィリエイトリンク
// homeUrl: アフィリエイトプログラムのホームページ
// type: 'banner' または 'card'
// image: ロゴ画像のパス
// icon: 画像がない場合のアイコン
// description: サービスの説明
// status: 'ready' (準備完了) or 'pending' (準備中)
// bannerHtml: バナー表示用のHTML
// categories: サービスのカテゴリ (hotel, flight, activity, transport, esim, etc.)
export const affiliates: AffiliatesProps[] = [
  {
    name: "Trip.com",
    affiliateUrl: "https://www.trip.com/t/D0ylJTzCzS2",
    homeUrl: "https://jp.trip.com/partners/index",
    type: "banner",
    icon: <BedDouble className="w-10 h-10 text-primary" />,
    description:
      "航空券・ホテル・列車まで、旅の予約がこれ一つで完結！セールも豊富でお得に旅しよう。",
    status: "ready",
    bannerHtml: `<iframe border="0" src="https://jp.trip.com/partners/ad/DB9811384?Allianceid=7162828&SID=263803828&trip_sub1=Global%E7%94%A8" style="width:300px;height:250px" frameborder="0" scrolling="no" style="border:none" id="DB9811384"></iframe>`,
    categories: ["flight", "hotel", "train"],
  },
  {
    name: "Booking.com",
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE",
    homeUrl: "YOUR_AFFILIATE_LINK_HERE",
    type: "card",
    icon: <BedDouble className="w-10 h-10 text-primary" />,
    description: "世界中のホテルや宿を網羅。豊富な口コミで安心して選べます。",
    status: "pending",
    bannerHtml: `<a href="YOUR_AFFILIATE_LINK_HERE" target="_blank" rel="noopener noreferrer"><img src="https://via.placeholder.com/1200x400.png?text=Booking.com+Banner" alt="Booking.com Banner"/></a>`,
    categories: ["hotel"],
  },
  {
    name: "Airbnb",
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE",
    homeUrl: "YOUR_AFFILIATE_LINK_HERE",
    type: "card",
    icon: <Home className="w-10 h-10 text-primary" />,
    description: "現地の人から借りるユニークな宿で、特別な宿泊体験を。",
    status: "pending",
    bannerHtml: `<a href="YOUR_AFFILIATE_LINK_HERE" target="_blank" rel="noopener noreferrer"><img src="https://via.placeholder.com/1200x400.png?text=Airbnb+Banner" alt="Airbnb Banner"/></a>`,
    categories: ["hotel"],
  },
  {
    name: "Klook",
    affiliateUrl:
      "https://affiliate.klook.com/redirect?aid=99371&aff_adid=1126092&k_site=https%3A%2F%2Fwww.klook.com%2F",
    homeUrl: "https://affiliate.klook.com/ja/",
    type: "card",
    icon: <Ticket className="w-10 h-10 text-primary" />,
    description: "遊びの予約に特化。テーマパークや現地ツアーをお得に予約。",
    status: "ready",
    bannerHtml: `<a href="https://affiliate.klook.com/redirect?aid=99371&aff_adid=1126092&k_site=https%3A%2F%2Fwww.klook.com%2F" target="_blank" rel="noopener noreferrer"><img src="https://via.placeholder.com/1200x400.png?text=Klook+Banner" alt="Klook Banner"/></a>`,
    categories: ["activity"],
  },
  {
    name: "GetYourGuide",
    affiliateUrl:
      "https://www.getyourguide.com?partner_id=GTNOM0E&utm_medium=online_publisher",
    homeUrl: "https://partner.getyourguide.com/",
    type: "card",
    icon: <Ticket className="w-10 h-10 text-primary" />,
    description: "世界中のユニークな体験ツアーが見つかる。旅の思い出作りに。",
    status: "ready",
    bannerHtml: `<a href="https://www.getyourguide.com?partner_id=GTNOM0E&utm_medium=online_publisher" target="_blank" rel="noopener noreferrer"><img src="https://via.placeholder.com/1200x400.png?text=GetYourGuide+Banner" alt="GetYourGuide Banner"/></a>`,
    categories: ["activity"],
  },
  {
    name: "Omio",
    affiliateUrl: "https://omio.sjv.io/MAqKX2",
    homeUrl: "https://www.omio.jp/affiliate",
    type: "card",
    icon: <Train className="w-10 h-10 text-primary" />,
    description: "ヨーロッパの鉄道やバスをまとめて検索・予約。周遊旅行に便利。",
    status: "ready",
    bannerHtml: `<a href="https://omio.sjv.io/MAqKX2" target="_blank" rel="noopener noreferrer"><img src="https://via.placeholder.com/1200x400.png?text=Omio+Banner" alt="Omio Banner"/></a>`,
    categories: ["transport"],
  },
  {
    name: "SkyScanner",
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE",
    homeUrl: "YOUR_AFFILIATE_LINK_HERE",
    type: "card",
    icon: <Plane className="w-10 h-10 text-primary" />,
    description: "世界中の航空券を一発で比較",
    status: "pending",
    bannerHtml: `<a href="YOUR_AFFILIATE_LINK_HERE" target="_blank" rel="noopener noreferrer"><img src="https://via.placeholder.com/1200x400.png?text=SkyScanner+Banner" alt="SkyScanner Banner"/></a>`,
    categories: ["flight"],
  },
  {
    name: "Trifa",
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE",
    homeUrl: "YOUR_AFFILIATE_LINK_HERE",
    type: "card",
    icon: <Wifi className="w-10 h-10 text-primary" />,
    description: "eSIMで海外でもスマホを快適に。SIMの差し替え不要で楽々。",
    status: "pending",
    bannerHtml: `<a href="YOUR_AFFILIATE_LINK_HERE" target="_blank" rel="noopener noreferrer"><img src="https://via.placeholder.com/1200x400.png?text=Trifa+Banner" alt="Trifa Banner"/></a>`,
    categories: ["esim"],
  },
  {
    name: "一休.com",
    affiliateUrl:
      "//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3759091&pid=892355798",
    homeUrl: "https://www.ikyu.com/",
    type: "card",
    icon: <BedDouble className="w-10 h-10 text-primary" />,
    description:
      "全国約7,000の厳選した高級ホテル・旅館、またワンランク上のビジネスホテルを",
    status: "ready",
    bannerHtml: `<a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3759091&pid=892355798" rel="nofollow">自由テキスト</a><amp-img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3759091&pid=892355798" height="1" width="1"></amp-img>`,
    categories: ["hotel"],
  },
];
