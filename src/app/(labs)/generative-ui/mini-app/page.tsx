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
import { Send, Sparkles, RefreshCcw, History, LayoutDashboard, Settings2, ArrowRight, Compass } from "lucide-react";
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
  if (part.state !== "input-available" || !part.input) return (
    <div className="w-full h-32 bg-muted/20 animate-pulse rounded-xl flex items-center justify-center border border-dashed border-muted-foreground/30">
      <div className="flex flex-col items-center gap-2">
        <Sparkles className="w-5 h-5 text-muted-foreground/50 animate-spin" />
        <span className="text-xs text-muted-foreground font-medium">コンポーネントを構築中...</span>
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
          case "compareDestinations": return <DestinationComparisonBoard {...args} />;
          case "showAirportAnxiety": return <AirportAnxietyMap {...args} />;
          case "simulateBudget": return <BudgetSimulator {...args} />;
          case "showPhotoSpots": return <PhotoOppsComparison {...args} />;
          case "embedArticles": return <ArticleEmbedder {...args} />;
          case "showItinerary": return <ItineraryDisplay {...args} />;
          case "showPackingList": return <PackingList {...args} />;
          default: return null;
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
  const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
  // ツールパーツを抽出
  const activeTools = lastAssistantMessage?.parts.filter(p => p.type === "dynamic-tool") as ToolPart[] || [];
  // テキストパーツを抽出（解説用）
  const explanatoryText = lastAssistantMessage?.parts.filter(p => p.type === "text").map(p => (p as TextPart).text).join("\n") || "";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const updateAssistant = (id: string, updater: (parts: ChatPart[]) => ChatPart[]) => {
    setMessages(prev =>
      prev.map(m => m.id === id ? { ...m, parts: updater(m.parts) } : m)
    );
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
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", parts: [] }]);

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
                updateAssistant(assistantId, parts => [...parts, { type: "text", text: "" }]);
                break;

              case "text-delta":
                updateAssistant(assistantId, parts => {
                  const last = parts[parts.length - 1];
                  if (last?.type === "text") {
                    return [...parts.slice(0, -1), { ...last, text: last.text + (chunk.delta as string ?? "") }];
                  }
                  return [...parts, { type: "text", text: chunk.delta as string ?? "" }];
                });
                break;

              case "tool-input-start":
                updateAssistant(assistantId, parts => [...parts, {
                  type: "dynamic-tool",
                  state: "input-streaming",
                  toolName: chunk.toolName as string,
                  toolCallId: chunk.toolCallId as string,
                }]);
                break;

              case "tool-input-available":
                updateAssistant(assistantId, parts =>
                  parts.map(p =>
                    p.type === "dynamic-tool" && p.toolCallId === (chunk.toolCallId as string)
                      ? { ...p, state: "input-available" as const, input: chunk.input }
                      : p
                  )
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
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (!lastUser || isLoading) return;
    const idx = messages.findIndex(m => m.id === lastUser.id);
    const userText = (lastUser.parts.find(p => p.type === "text") as TextPart | undefined)?.text ?? "";
    setMessages(messages.slice(0, idx));
    handleSubmit(undefined, userText);
  };

  const suggestedPrompts = [
    { label: "ギリシャの島々を比較", text: "3月にギリシャへ。サントリーニとアテネで迷ってる。予算と写真映えを比較して、おすすめを教えて。" },
    { label: "タイ・バンコク3日間", text: "バンコクに3日間行く予定。空港からの移動方法と、定番スポットを巡る効率的な日程案を作って。" },
    { label: "スペイン・バルセロナ", text: "バルセロナの治安と空港移動が不安。持ち物リストと満足度別の予算目安を教えて。" },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#f8fafc] dark:bg-[#020617] overflow-hidden">
      {/* Sidebar (History & Control) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-muted-foreground" />
              History
            </h2>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-muted-foreground">過去の相談履歴はありません</p>
              </div>
            ) : (
              messages.filter(m => m.role === "user").map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => {/* Navigate to this message state if implemented */}}
                  className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] text-muted-foreground mt-1 shrink-0">#{messages.length - (i * 2 + 1)}</span>
                    <p className="text-xs font-medium line-clamp-2 text-foreground/80 group-hover:text-foreground">
                      {(m.parts[0] as TextPart).text}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="p-4 border-t bg-muted/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Settings</span>
              <Settings2 className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-md bg-background/50 border border-border/50">
                <span className="text-xs">Model</span>
                <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">GEMINI 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <History className="w-5 h-5" />
          </Button>
          <h1 className="text-sm font-bold flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-primary" />
            Travel Dashboard
          </h1>
          <div className="w-5" />
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-transparent">
          <div className="max-w-6xl mx-auto p-4 lg:p-8">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center min-h-[60vh] text-center"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <div className="relative p-8 bg-card border rounded-3xl shadow-2xl">
                      <Compass className="w-16 h-16 text-primary animate-[spin_10s_linear_infinite]" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/50">
                    Travel AI Dashboard
                  </h1>
                  <p className="text-muted-foreground max-w-lg mb-12 leading-relaxed">
                    AIがあなたの悩みを分析し、最適な旅行管理アプリを瞬時に構成します。<br />
                    比較、予算、日程、持ち物まで、すべてを一つの画面で。
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                    {suggestedPrompts.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => handleSubmit(undefined, p.text)}
                        className="group p-4 bg-card border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all text-left"
                      >
                        <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors">{p.label}</h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{p.text}</p>
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
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-bold">Personalized Insight</h2>
                      </div>
                      <div className="p-5 bg-card border rounded-2xl shadow-sm leading-relaxed text-sm text-foreground/90 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                        {explanatoryText || (isLoading && <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />)}
                      </div>
                    </div>
                    {messages.length > 0 && !isLoading && (
                      <Button variant="outline" size="sm" onClick={handleRegenerate} className="shrink-0 rounded-full h-9 px-4">
                        <RefreshCcw className="w-3.5 h-3.5 mr-2" />
                        Regenerate
                      </Button>
                    )}
                  </div>

                  {/* Components Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {activeTools.length > 0 ? (
                      activeTools.map((part) => (
                        <div key={part.toolCallId} className="w-full h-full">
                          <ToolRenderer part={part} />
                        </div>
                      ))
                    ) : (
                      isLoading && [1, 2].map(i => (
                        <div key={i} className="w-full h-64 bg-card/50 border border-dashed rounded-3xl animate-pulse flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <Sparkles className="w-6 h-6 text-muted-foreground/20 mx-auto animate-spin" />
                            <p className="text-[10px] text-muted-foreground/40 font-medium">APP COMPONENT #{i}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 flex items-center justify-between">
                      <p className="text-sm font-medium">Error: {error}</p>
                      <Button variant="ghost" size="sm" onClick={() => setError(null)}>Dismiss</Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Command Center (Input) */}
        <div className="absolute bottom-0 inset-x-0 p-4 lg:p-8 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
          <div className="max-w-3xl mx-auto w-full pointer-events-auto">
            <form
              onSubmit={handleSubmit}
              className="relative group shadow-2xl rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 group-focus-within:bg-primary/10 transition-colors" />
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="次のアクションをAIに指示..."
                className="w-full bg-background/80 backdrop-blur-xl border border-border/50 px-6 py-5 pr-16 outline-none text-sm placeholder:text-muted-foreground/60 transition-all focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-2xl h-11 w-11 shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-all"
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
            <p className="text-center mt-3 text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-2 opacity-60">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              AI Planner v2.0 is active and ready
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
