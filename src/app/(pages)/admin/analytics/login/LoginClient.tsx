"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { toast } from "sonner";

// Analytics Console (常時ダーク) に合わせた自前スタイルのログイン画面
export default function LoginClient() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/analytics-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        toast.success("Login successful");
        router.push("/admin/analytics");
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.message || "Invalid password");
      }
    } catch {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
            <Activity className="size-6" />
          </span>
          <h1 className="text-xl font-bold tracking-tight text-slate-50">Analytics Console</h1>
          <p className="mt-1 text-xs text-slate-500">ともきちの旅行日記 — 運営者用ダッシュボード</p>
        </div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-400">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••"
          required
          className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full rounded-lg bg-sky-500 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
