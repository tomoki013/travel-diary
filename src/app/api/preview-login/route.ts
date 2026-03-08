import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const correctPassword = process.env.PREVIEW_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json(
      { message: "Server configuration error: PREVIEW_PASSWORD not set" },
      { status: 500 }
    );
  }

  if (password === correctPassword) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("preview_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
}
