import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// 入力スキーマ。長さ上限はスパム・巨大ペイロード対策。
const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  inquiryType: z.string().trim().min(1).max(100),
});

// IPごとの簡易レート制限(インスタンス内メモリ)。
// サーバーレスではインスタンスを跨いで共有されないが、
// 単一インスタンスからの連投スパムを防ぐ目的では十分機能する。
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1時間
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (timestamps.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);

  // Map が無限に成長しないよう古いエントリを掃除する
  if (requestLog.size > 1000) {
    for (const [key, value] of requestLog) {
      if (value.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        requestLog.delete(key);
      }
    }
  }

  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "送信回数の上限に達しました。しばらくしてからお試しください。" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "リクエストの形式が不正です。" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "すべてのフィールドを正しく入力してください。" },
      { status: 400 },
    );
  }

  const { name, email, subject, message, inquiryType } = parsed.data;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      // from にユーザー入力を使うと SPF/DMARC 検証に失敗して迷惑メール扱い
      // されやすく、なりすましにも悪用される。送信元は自アカウントに固定し、
      // 返信先(replyTo)に問い合わせ者のアドレスを設定する。
      from: process.env.GMAIL_USER,
      replyTo: email,
      to: process.env.GMAIL_USER,
      subject: `お問い合わせ: ${subject.replace(/[\r\n]/g, " ")}`,
      text: `名前: ${name}\nメール: ${email}\n種類: ${inquiryType}\n\nメッセージ:\n${message}`,
    });

    return NextResponse.json({ message: "メールが送信されました。" }, { status: 200 });
  } catch (error: unknown) {
    console.error("メール送信エラー:", error instanceof Error ? error.message : error);
    return NextResponse.json({ message: "メール送信に失敗しました。" }, { status: 500 });
  }
}
