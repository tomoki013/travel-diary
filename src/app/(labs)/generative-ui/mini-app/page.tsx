"use client";

import React, { useState, useEffect, useRef } from "react";
import { DestinationComparisonBoard } from "@/components/generative-ui/DestinationComparisonBoard";
import { AirportAnxietyMap } from "@/components/generative-ui/AirportAnxietyMap";
import { BudgetSimulator } from "@/components/generative-ui/BudgetSimulator";
import { PhotoOppsComparison } from "@/components/generative-ui/PhotoOppsComparison";
import { ArticleEmbedder } from "@/components/generative-ui/ArticleEmbedder";
import { ItineraryDisplay } from "@/components/generative-ui/ItineraryDisplay";
import { PackingList } from "@/components/generative-ui/PackingList";
import { Button } from "@/components/ui/button";
import {
  Send,
  Sparkles,
  RefreshCcw,
  History,
  LayoutDashboard,
  Settings2,
  ArrowRight,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TextPart = { type: "text"; text: string };
type ToolPart = {
  type: "dynamic-tool";
  state: "input-streaming" | "input-available";
  toolName: string;
  toolCallId: string;
  input?: unknown;
};
type ChatPart = TextPart | ToolPart;

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  parts: ChatPart[];
}

function ToolRenderer({ part }: { part: ToolPart }) {
  if (part.state !== "input-available" || !part.input)
    return (
      <div className="bg-muted/20 border-muted-foreground/30 flex h-32 w-full animate-pulse items-center justify-center rounded-xl border border-dashed">
        <div className="flex flex-col items-center gap-2">
          <Sparkles className="text-muted-foreground/50 h-5 w-5 animate-spin" />
          <span className="text-muted-foreground text-xs font-medium">
            コンポーネントを構築中...
          </span>
        </div>
      </div>
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const args = part.input as any;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      {(() => {
        switch (part.toolName) {
          case "compareDestinations":
            return <DestinationComparisonBoard {...args} />;
          case "showAirportAnxiety":
            return <AirportAnxietyMap {...args} />;
          case "simulateBudget":
            return <BudgetSimulator {...args} />;
          case "showPhotoSpots":
            return <PhotoOppsComparison {...args} />;
          case "embedArticles":
            return <ArticleEmbedder {...args} />;
          case "showItinerary":
            return <ItineraryDisplay {...args} />;
          case "showPackingList":
            return <PackingList {...args} />;
          default:
            return null;
        }
      })()}
    </motion.div>
  );
}

export default function GenerativeUIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // 最後に生成されたアシスタントのメッセージを取得
  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant");
  // ツールパーツを抽出
  const activeTools =
    (lastAssistantMessage?.parts.filter((p) => p.type === "dynamic-tool") as ToolPart[]) || [];
  // テキストパーツを抽出（解説用）
  const explanatoryText =
    lastAssistantMessage?.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as TextPart).text)
      .join("\n") || "";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const updateAssistant = (id: string, updater: (parts: ChatPart[]) => ChatPart[]) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, parts: updater(m.parts) } : m)));
  };

  const handleSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    e?.preventDefault();
    const text = overrideText ?? input.trim();
    if (!text || isLoading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text }],
    };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", parts: [] }]);

    try {
      const res = await fetch("/api/generative-ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => `HTTP ${res.status}`);
        throw new Error(msg || `HTTP ${res.status}`);
      }
      if (!res.body) throw new Error("Empty response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === "[DONE]") continue;

          try {
            const chunk = JSON.parse(raw) as { type: string; [k: string]: unknown };

            switch (chunk.type) {
              case "text-start":
                updateAssistant(assistantId, (parts) => [...parts, { type: "text", text: "" }]);
                break;

              case "text-delta":
                updateAssistant(assistantId, (parts) => {
                  const last = parts[parts.length - 1];
                  if (last?.type === "text") {
                    return [
                      ...parts.slice(0, -1),
                      { ...last, text: last.text + ((chunk.delta as string) ?? "") },
                    ];
                  }
                  return [...parts, { type: "text", text: (chunk.delta as string) ?? "" }];
                });
                break;

              case "tool-input-start":
                updateAssistant(assistantId, (parts) => [
                  ...parts,
                  {
                    type: "dynamic-tool",
                    state: "input-streaming",
                    toolName: chunk.toolName as string,
                    toolCallId: chunk.toolCallId as string,
                  },
                ]);
                break;

              case "tool-input-available":
                updateAssistant(assistantId, (parts) =>
                  parts.map((p) =>
                    p.type === "dynamic-tool" && p.toolCallId === (chunk.toolCallId as string)
                      ? { ...p, state: "input-available" as const, input: chunk.input }
                      : p,
                  ),
                );
                break;
            }
          } catch {
            // skip malformed chunk
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const msg = (err as Error).message || "エラーが発生しました";
      setError(msg);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const handleRegenerate = async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser || isLoading) return;
    const idx = messages.findIndex((m) => m.id === lastUser.id);
    const userText =
      (lastUser.parts.find((p) => p.type === "text") as TextPart | undefined)?.text ?? "";
    setMessages(messages.slice(0, idx));
    handleSubmit(undefined, userText);
  };

  const suggestedPrompts = [
    {
      label: "ギリシャの島々を比較",
      text: "3月にギリシャへ。サントリーニとアテネで迷ってる。予算と写真映えを比較して、おすすめを教えて。",
    },
    {
      label: "タイ・バンコク3日間",
      text: "バンコクに3日間行く予定。空港からの移動方法と、定番スポットを巡る効率的な日程案を作って。",
    },
    {
      label: "スペイン・バルセロナ",
      text: "バルセロナの治安と空港移動が不安。持ち物リストと満足度別の予算目安を教えて。",
    },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#f8fafc] dark:bg-[#020617]">
      {/* Sidebar (History & Control) */}
      <aside
        className={`bg-background border-border fixed inset-y-0 left-0 z-50 w-80 border-r transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <History className="text-muted-foreground h-4 w-4" />
              History
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-muted-foreground text-xs">過去の相談履歴はありません</p>
              </div>
            ) : (
              messages
                .filter((m) => m.role === "user")
                .map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      /* Navigate to this message state if implemented */
                    }}
                    className="hover:bg-muted/50 hover:border-border group w-full rounded-lg border border-transparent p-3 text-left transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-muted-foreground mt-1 shrink-0 text-[10px]">
                        #{messages.length - (i * 2 + 1)}
                      </span>
                      <p className="text-foreground/80 group-hover:text-foreground line-clamp-2 text-xs font-medium">
                        {(m.parts[0] as TextPart).text}
                      </p>
                    </div>
                  </button>
                ))
            )}
          </div>

          <div className="bg-muted/20 border-t p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Settings
              </span>
              <Settings2 className="text-muted-foreground h-3 w-3" />
            </div>
            <div className="space-y-2">
              <div className="bg-background/50 border-border/50 flex items-center justify-between rounded-md border p-2">
                <span className="text-xs">Model</span>
                <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">
                  GEMINI 2.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Area */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-background/80 sticky top-0 z-40 flex items-center justify-between border-b p-4 backdrop-blur-md lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <History className="h-5 w-5" />
          </Button>
          <h1 className="flex items-center gap-2 text-sm font-bold">
            <LayoutDashboard className="text-primary h-4 w-4" />
            Travel Dashboard
          </h1>
          <div className="w-5" />
        </header>

        {/* Dashboard Content */}
        <div className="custom-scrollbar flex-1 overflow-y-auto bg-slate-50/30 dark:bg-transparent">
          <div className="mx-auto max-w-6xl p-4 lg:p-8">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex min-h-[60vh] flex-col items-center justify-center text-center"
                >
                  <div className="relative mb-8">
                    <div className="bg-primary/20 absolute inset-0 rounded-full blur-3xl" />
                    <div className="bg-card relative rounded-3xl border p-8 shadow-2xl">
                      <Compass className="text-primary h-16 w-16 animate-[spin_10s_linear_infinite]" />
                    </div>
                  </div>
                  <h1 className="from-foreground to-foreground/50 mb-4 bg-gradient-to-br bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                    Travel AI Dashboard
                  </h1>
                  <p className="text-muted-foreground mb-12 max-w-lg leading-relaxed">
                    AIがあなたの悩みを分析し、最適な旅行管理アプリを瞬時に構成します。
                    <br />
                    比較、予算、日程、持ち物まで、すべてを一つの画面で。
                  </p>

                  <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
                    {suggestedPrompts.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => handleSubmit(undefined, p.text)}
                        className="group bg-card hover:border-primary/50 rounded-xl border p-4 text-left transition-all hover:shadow-lg"
                      >
                        <h3 className="group-hover:text-primary mb-2 text-sm font-bold transition-colors">
                          {p.label}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2 text-[11px] leading-relaxed">
                          {p.text}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8 pb-32"
                >
                  {/* Assistant Feedback Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="bg-primary/10 rounded-lg p-1.5">
                          <Sparkles className="text-primary h-4 w-4" />
                        </div>
                        <h2 className="text-lg font-bold">Personalized Insight</h2>
                      </div>
                      <div className="bg-card text-foreground/90 relative overflow-hidden rounded-2xl border p-5 text-sm leading-relaxed shadow-sm">
                        <div className="bg-primary/40 absolute top-0 left-0 h-full w-1" />
                        {explanatoryText ||
                          (isLoading && (
                            <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                          ))}
                      </div>
                    </div>
                    {messages.length > 0 && !isLoading && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerate}
                        className="h-9 shrink-0 rounded-full px-4"
                      >
                        <RefreshCcw className="mr-2 h-3.5 w-3.5" />
                        Regenerate
                      </Button>
                    )}
                  </div>

                  {/* Components Grid */}
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {activeTools.length > 0
                      ? activeTools.map((part) => (
                          <div key={part.toolCallId} className="h-full w-full">
                            <ToolRenderer part={part} />
                          </div>
                        ))
                      : isLoading &&
                        [1, 2].map((i) => (
                          <div
                            key={i}
                            className="bg-card/50 flex h-64 w-full animate-pulse items-center justify-center rounded-3xl border border-dashed"
                          >
                            <div className="space-y-2 text-center">
                              <Sparkles className="text-muted-foreground/20 mx-auto h-6 w-6 animate-spin" />
                              <p className="text-muted-foreground/40 text-[10px] font-medium">
                                APP COMPONENT #{i}
                              </p>
                            </div>
                          </div>
                        ))}
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive border-destructive/20 flex items-center justify-between rounded-2xl border p-4">
                      <p className="text-sm font-medium">Error: {error}</p>
                      <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                        Dismiss
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Command Center (Input) */}
        <div className="from-background via-background pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-4 lg:p-8">
          <div className="pointer-events-auto mx-auto w-full max-w-3xl">
            <form
              onSubmit={handleSubmit}
              className="group relative overflow-hidden rounded-3xl shadow-2xl"
            >
              <div className="bg-primary/5 group-focus-within:bg-primary/10 absolute inset-0 transition-colors" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="次のアクションをAIに指示..."
                className="bg-background/80 border-border/50 placeholder:text-muted-foreground/60 focus:ring-primary/20 w-full border px-6 py-5 pr-16 text-sm backdrop-blur-xl transition-all outline-none focus:ring-2"
                disabled={isLoading}
              />
              <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
                <Button
                  type="submit"
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Sparkles className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
            <p className="text-muted-foreground mt-3 flex items-center justify-center gap-2 text-center text-[10px] font-medium opacity-60">
              <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              AI Planner v2.0 is active and ready
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
