"use client";

import { FormEvent, useMemo, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { storeProducts } from "@/lib/store/catalog";

type SupportFormProps = {
  initialProduct?: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function SupportForm({ initialProduct = "" }: SupportFormProps) {
  const startedAt = useMemo(() => Date.now(), []);
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/store/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, startedAt }),
      });

      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message || "送信に失敗しました。");
      }

      form.reset();
      setState("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "送信に失敗しました。");
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="border-border bg-card rounded-2xl border p-8 text-center shadow-sm">
        <h2 className="font-heading text-2xl font-bold">送信しました</h2>
        <p className="text-muted-foreground mt-3 leading-7">
          よくある質問はAIが確認し、安全に回答できる場合のみメールで自動返信します。
          確認が必要な内容は、ともきちが引き継ぎます。
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-card rounded-2xl border p-6 shadow-sm sm:p-8"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold">メールアドレス</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="border-input bg-background focus:ring-primary w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold">商品</span>
          <select
            name="product"
            defaultValue={initialProduct}
            className="border-input bg-background focus:ring-primary w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
          >
            <option value="">購入前の相談・その他</option>
            {storeProducts.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block space-y-2">
        <span className="text-sm font-bold">注文番号（購入後のみ・任意）</span>
        <input
          type="text"
          name="orderId"
          maxLength={100}
          className="border-input bg-background focus:ring-primary w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
        />
      </label>

      <label className="mt-5 block space-y-2">
        <span className="text-sm font-bold">お問い合わせ内容</span>
        <textarea
          required
          name="message"
          minLength={10}
          maxLength={3000}
          rows={8}
          className="border-input bg-background focus:ring-primary w-full resize-y rounded-xl border px-4 py-3 leading-7 outline-none focus:ring-2"
          placeholder="利用環境、困っていること、試したことなどを書いてください。"
        />
      </label>

      {state === "error" && (
        <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="bg-primary text-primary-foreground mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "submitting" ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {state === "submitting" ? "送信中" : "送信する"}
      </button>

      <p className="text-muted-foreground mt-4 text-center text-xs leading-5">
        返金・法務・個人情報・セキュリティに関する内容は自動回答せず、人が確認します。
      </p>
    </form>
  );
}
