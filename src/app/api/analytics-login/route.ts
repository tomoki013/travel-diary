import { NextRequest, NextResponse } from "next/server";

// /admin/analytics 用のログイン。/api/preview-login と同じ
// 「環境変数のパスワード照合 + Cookie」方式。
export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const correctPassword = process.env.ANALYTICS_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json(
      { message: "Server configuration error: ANALYTICS_PASSWORD not set" },
      { status: 500 },
    );
  }

  if (password === correctPassword) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("analytics_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
}
