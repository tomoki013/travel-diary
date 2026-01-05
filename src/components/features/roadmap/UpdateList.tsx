"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Tag } from "lucide-react";

const UPDATES = [
  {
    date: "2025.12.15",
    version: "v4.5",
    title: "AI旅行プランナー (Beta) & 3D Globe 公開",
    content: "AIがあなたの旅をサポートする旅行プランナーと、旅の軌跡を3Dで体感できる地球儀機能をリリースしました。",
    type: "Feature",
    isNew: true,
  },
  {
    date: "2025.09.20",
    version: "v4.0",
    title: "デザイン刷新 & オフライン対応",
    content: "独自の世界観を表現する新デザインへリニューアル。また、電波の届かない場所でも記事が読めるオフライン機能を追加しました。",
    type: "Major",
  },
  {
    date: "2025.06.10",
    version: "v3.5",
    title: "サイト内検索機能の実装",
    content: "過去の記事を瞬時に検索できる機能を搭載しました。キーワードから思い出の旅を探せます。",
    type: "Feature",
  },
  {
    date: "2025.03.01",
    version: "v3.0",
    title: "ギャラリー & ツール機能の追加",
    content: "旅の写真を一覧できるギャラリーや、世界時計・通貨計算などの便利ツールを追加しました。",
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
                        variant={item.type === "Major" ? "default" : "secondary"}
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
