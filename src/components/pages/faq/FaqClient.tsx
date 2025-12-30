"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FaqItem = {
  question: string;
  answer: string;
  category: string;
  tags: string[];
};

type FaqClientProps = {
  distributionData: { name: string; value: number }[];
  phaseData: { name: string; value: number; tips: string }[];
  faqs: FaqItem[];
};

// Colors from globals.css variables (approximated for Recharts)
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function FaqClient({
  distributionData,
  phaseData,
  faqs,
}: FaqClientProps) {
  const [currentCategory, setCurrentCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory =
      currentCategory === "all" || item.category === currentCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: "all", label: "すべて表示" },
    { id: "destinations", label: "旅行先・エリア" },
    { id: "hotels", label: "ホテル・宿泊" },
    { id: "preparation", label: "準備・マイル" },
    { id: "site-info", label: "サイト・ツール" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = () => {
    scrollToSection("faq-engine");
  };

  const resetFilters = () => {
    setCurrentCategory("all");
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-muted/30 py-12 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
            旅の準備とヒントを深掘りする
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Tomokichi Diaryのアーカイブを分析し、あなたの疑問に答えるためのガイドです。
            <br />
            サイトマップ構造に基づき、よくある質問と回答を整理しました。
          </p>
          <div className="relative max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="「ホテル」「マイル」「おすすめ」などで検索..."
              className="w-full px-6 py-6 rounded-full border-input shadow-sm text-lg transition pr-24 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              className="absolute right-2 top-2 bottom-2 rounded-full font-medium transition"
              onClick={handleSearch}
            >
              検索
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="mb-10 text-center md:text-left">
          <h3 className="text-2xl font-bold text-foreground mb-2 font-heading">
            サイトコンテンツ分析
          </h3>
          <p className="text-muted-foreground max-w-2xl">
            このサイトがどのような情報を扱っているか、その全体像を可視化しました。旅行計画のどの段階でどの記事を読むべきかが一目でわかります。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Chart 1: Content Distribution */}
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h4 className="text-lg font-semibold text-card-foreground mb-4 text-center">
              記事カテゴリーの割合
            </h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      borderColor: "var(--border)",
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              ホテル宿泊記と旅行ガイドが中心コンテンツです。
            </p>
          </div>

          {/* Chart 2: Planning Timeline */}
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h4 className="text-lg font-semibold text-card-foreground mb-4 text-center">
              旅行フェーズ別おすすめ記事
            </h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={phaseData}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover border border-border p-2 rounded shadow-md text-popover-foreground text-sm">
                            <p className="font-bold">{data.name}</p>
                            <p>{data.tips}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="var(--primary)"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              出発前の準備から当日の滞在記まで幅広くカバーしています。
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Engine Section */}
      <section
        id="faq-engine"
        className="bg-background py-16 border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">
              Q&A エクスプローラー
            </h3>
            <p className="text-muted-foreground mb-6">
              カテゴリーを選択して、Tomokichi Diaryが提供する価値を探求してください。
            </p>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCurrentCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    currentCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Grid */}
          {filteredFaqs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFaqs.map((item, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="capitalize">
                      {categories.find((c) => c.id === item.category)?.label ||
                        "その他"}
                    </Badge>
                  </div>
                  <h4 className="text-lg font-bold text-card-foreground mb-3 leading-snug">
                    Q. {item.question}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                    {item.answer}
                  </p>
                  <div className="mt-auto pt-4 border-t border-border flex flex-wrap gap-2">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="text-xs text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                該当する質問が見つかりませんでした。別のキーワードをお試しください。
              </p>
              <Button
                variant="link"
                onClick={resetFilters}
                className="mt-4 text-primary font-medium hover:underline"
              >
                フィルターをリセット
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
