"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Tag } from "lucide-react";

const UPDATES = [
  {
    date: "2025.12.25",
    version: "v6.2.0",
    title: "PWAの修正",
    content: "PWAで一部表示崩れを修正しました。",
    type: "Fix",
    isNew: true,
  },
  {
    date: "2025.12.23",
    version: "v6.1.0",
    title: "AIトラベルプランナーの大幅修正と独立アプリ化",
    content:
      "AIトラベルプランナーのUIを大きく変更し、サイトコンセプトに合わせました。また、ともきちの旅行日記とは独立したアプリとしました。",
    type: "Enhancement",
  },
  {
    date: "2025.12.13",
    version: "v6.0.0",
    title: "AIトラベルプランナーを公開",
    content: "AIがあなたの旅をサポートするAIトラベルプランナーを公開しました。",
    type: "Feature",
  },
  {
    date: "2025.12.13",
    version: "v5.0.0",
    title: "Tomokichi Globe 公開",
    content:
      "3Dマップで訪れた場所を可視化できるTomokichi Globeを公開しました。",
    type: "Major",
  },
  {
    date: "2025.10.16",
    version: "v4.5.5",
    title: "FAQページを実装",
    content: "よくある質問をまとめたFAQページを実装しました。",
    type: "Feature",
  },
  {
    date: "2025.10.02",
    version: "v4.5.0",
    title: "AIプランナー機能を実験的に公開。",
    content:
      "アフィリエイトプログラムに参加し、いいと感じた商品をより多くの人に届けることを目的としました。",
    type: "Experimental",
  },
  {
    date: "2025.09.06",
    version: "v4.4.0",
    title: "アフィリエイトプログラムに参加",
    content:
      "アフィリエイトプログラムに参加し、いいと感じた商品をより多くの人に届けることを目的としました。",
    type: "News",
  },
  {
    date: "2025.09.05",
    version: "v4.3.0",
    title: "PWA対応",
    content: "PWAに対応し、オフラインでも利用できるようになりました。",
    type: "Feature",
  },
  {
    date: "2025.09.01",
    version: "v4.2.0",
    title: "世界地図の導入",
    content:
      "地域表示に世界地図を導入。地域をより視覚的にとらえられるようにしました。",
    type: "Feature",
  },
  {
    date: "2025.08.21",
    version: "v4.0.1",
    title: "ローディングアニメーションの実装",
    content:
      "サイトコンセプトの再定義に伴い、独自のローディングアニメーションを実装しました。",
    type: "Design",
  },
  {
    date: "2025.08.21",
    version: "v4.0.0",
    title: "サイトコンセプトおよびデザインの刷新",
    content:
      "サイトコンセプトを再定義。またそれに合わせて独自の世界観を表現する新デザインへリニューアルし、より旅の魅力を伝えられるデザインにしました。",
    type: "Major",
  },
  {
    date: "2025.06.06",
    version: "v3.5.8",
    title: "世界時計の機能追加",
    content: "都市と都市の時差を比較する機能を追加したました。",
    type: "Feature",
  },
  {
    date: "2025.06.05",
    version: "v3.5.5",
    title: "サイト内検索の精度アップ",
    content: "より関連度の高い記事が上に来るようにしました。",
    type: "Improvement",
  },
  {
    date: "2025.04.22",
    version: "v3.5.0",
    title: "サイト内検索機能の実装",
    content:
      "過去の記事を瞬時に検索できる機能を搭載しました。キーワードから思い出の旅を探せます。",
    type: "Feature",
  },
  {
    date: "2025.04.21",
    version: "v3.2.0",
    title: "旅に便利なツールの追加",
    content:
      "世界時計、通貨換算、割り勘計算など、旅に便利なツールを追加しました。",
    type: "Feature",
  },
  {
    date: "2025.03.07",
    version: "v3.0.0",
    title: "UIとUXの大幅リニューアル",
    content:
      "より機能的で、見やすいデザインへリニューアルしました。また、旅の写真を一覧できるギャラリーを追加し、美しい写真から次の旅先を探すことができるようになりました。",
    type: "Major",
  },
  {
    date: "2024.12.11",
    version: "v2.0.0",
    title: "表示速度を高速化",
    content: "表示速度を大幅に高速化しました。",
    type: "Performance",
  },
  {
    date: "2024.09.15",
    version: "v1.0.0",
    title: "ともきちの旅行日記公開",
    content:
      "ともきちの旅行日記として、旅行ブログサイトの開発・運営を開始しました。",
    type: "Major",
  },
];

export default function UpdateList() {
  return (
    <section className="py-12 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
          Update History
        </h2>
        <p className="text-muted-foreground">ともきちの旅行日記の進化の記録</p>
      </div>

      <div className="space-y-6">
        {UPDATES.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Meta Info */}
                  <div className="md:w-48 flex-shrink-0 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-border pb-4 md:pb-0 md:pr-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="font-mono text-sm">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      <span className="font-bold text-lg">{item.version}</span>
                    </div>
                    <div>
                      <Badge
                        variant={
                          item.type === "Major"
                            ? "default"
                            : item.type === "Fix"
                              ? "destructive"
                              : item.type === "Experimental"
                                ? "outline"
                                : "secondary"
                        }
                        className="mt-1"
                      >
                        {item.type} Update
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-foreground">
                        {item.title}
                      </h3>
                      {item.isNew && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
