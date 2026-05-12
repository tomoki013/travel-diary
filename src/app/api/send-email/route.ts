import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, subject, message, inquiryType } = body;

  if (!name || !email || !subject || !message || !inquiryType) {
    return NextResponse.json(
      { message: "すべてのフィールドを入力してください。" },
      { status: 400 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: true, // ここを追加して、自己署名証明書を許可
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.GMAIL_USER,
      subject: `お問い合わせ: ${subject}`,
      text: `名前: ${name}\nメール: ${email}\n種類: ${inquiryType}\n\nメッセージ:\n${message}`,
    });

    return NextResponse.json({ message: "メールが送信されました。" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("メール送信エラー:", error.message);
      console.error("詳細:", error);
    } else {
      console.error("予期しないエラー:", error);
    }
    return NextResponse.json({ message: "メール送信に失敗しました。" }, { status: 500 });
  }
}
