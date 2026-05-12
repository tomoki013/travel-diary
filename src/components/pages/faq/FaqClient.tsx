"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FAQ_CATEGORIES, FaqItem } from "@/data/faq";
import { useHydrated } from "@/hooks/useHydrated";

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

export default function FaqClient({ distributionData, phaseData, faqs }: FaqClientProps) {
  const hydrated = useHydrated();
  const [currentCategory, setCurrentCategory] = useState("all");
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = currentCategory === "all" || item.category === currentCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
    setInputValue("");
    setSearchQuery("");
  };

  const hasSearchInput = inputValue.length > 0;

  return (
    <div className="flex min-h-screen flex-col font-sans">
      {/* Hero Section */}
      <section className="bg-muted/30 border-border border-b py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-foreground font-heading mb-4 text-3xl font-bold md:text-4xl">
            このサイトの使い方と、よくある質問
          </h2>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            記事の探し方、旅行記と実用記事の違い、Gallery や補助機能の役割などをまとめています。
            <br />
            気になるキーワードから、そのまま読み方を見つけられる FAQ です。
          </p>
          <div className="relative mx-auto max-w-xl">
            <Input
              type="text"
              placeholder="「初海外」「旅行記」「Gallery」「AI旅行プランナー」などで検索..."
              className="border-input bg-background w-full rounded-full px-6 py-6 pr-24 text-lg shadow-sm transition"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button
              className="absolute top-2 right-2 bottom-2 rounded-full font-medium transition"
              onClick={handleSearch}
            >
              検索
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section
        id="dashboard"
        className={`mx-auto w-full max-w-7xl px-4 py-16 ${hasSearchInput ? "order-2" : "order-1"}`}
      >
        <div className="mb-10 text-center md:text-left">
          <h3 className="text-foreground font-heading mb-2 text-2xl font-bold">
            サイトコンテンツ分析
          </h3>
          <p className="text-muted-foreground max-w-2xl">
            このサイトにどんな記事があり、どのタイミングで読み始めると使いやすいかを俯瞰できます。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {/* Chart 1: Content Distribution */}
          <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
            <h4 className="text-card-foreground mb-4 text-center text-lg font-semibold">
              記事カテゴリーの割合
            </h4>
            <div className="h-[300px] w-full">
              {hydrated ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
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
                      {distributionData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              ) : null}
            </div>
            <p className="text-muted-foreground mt-4 text-center text-sm">
              旅行記、観光ガイド、モデルコースなどの構成をひと目で見られます。
            </p>
          </div>

          {/* Chart 2: Planning Timeline */}
          <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
            <h4 className="text-card-foreground mb-4 text-center text-lg font-semibold">
              旅行フェーズ別おすすめ記事
            </h4>
            <div className="h-[300px] w-full">
              {hydrated ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                  <BarChart
                    layout="vertical"
                    data={phaseData}
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border-border text-popover-foreground rounded border p-2 text-sm shadow-md">
                              <p className="font-bold">{data.name}</p>
                              <p>{data.tips}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </div>
            <p className="text-muted-foreground mt-4 text-center text-sm">
              行き先選びから現地移動まで、読むタイミングの目安を整理しています。
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Engine Section */}
      <section
        id="faq-engine"
        className={`bg-background border-border border-t py-16 ${
          hasSearchInput ? "order-1" : "order-2"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10">
            <h3 className="text-foreground font-heading mb-4 text-2xl font-bold">
              Q&A エクスプローラー
            </h3>
            <p className="text-muted-foreground mb-6">
              気になる入口から絞り込みながら、このサイトの使い方を探せます。
            </p>

            {/* Category Filters */}
            <div className="mb-8 flex flex-wrap gap-2">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCurrentCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {filteredFaqs.map((item, index) => (
                <div
                  key={index}
                  className="bg-card border-border flex h-full flex-col rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <Badge variant="outline" className="capitalize">
                      {FAQ_CATEGORIES.find((c) => c.id === item.category)?.label || "その他"}
                    </Badge>
                  </div>
                  <h4 className="text-card-foreground mb-3 text-lg leading-snug font-bold">
                    Q. {item.question}
                  </h4>
                  <p className="text-muted-foreground mb-4 flex-grow text-sm leading-relaxed">
                    {item.answer}
                  </p>
                  <div className="border-border mt-auto flex flex-wrap gap-2 border-t pt-4">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="text-muted-foreground text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                該当する質問が見つかりませんでした。別のキーワードをお試しください。
              </p>
              <Button
                variant="link"
                onClick={resetFilters}
                className="text-primary mt-4 font-medium hover:underline"
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
