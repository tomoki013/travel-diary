"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const UPDATES = [
  {
    date: "2025.12.15",
    version: "v4.5",
    title: "AI旅行プランナー (Beta) & 3D Globe 公開",
    content: "AIがあなたの旅をサポートする旅行プランナーと、旅の軌跡を3Dで体感できる地球儀機能をリリースしました。",
    type: "Feature",
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
    <section className="py-12 max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl font-heading font-bold text-primary">
          Update Information
        </h2>
        <div className="h-px bg-border flex-1" />
      </div>

      <div className="space-y-8">
        {UPDATES.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col md:flex-row gap-4 md:gap-8 border-l-2 border-muted pl-6 relative"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-background border-2 border-primary" />

            <div className="md:w-32 flex-shrink-0">
              <span className="text-sm text-muted-foreground font-mono">{item.date}</span>
              <div className="mt-1">
                <Badge variant={item.type === "Major" ? "default" : "secondary"}>
                  {item.version}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
