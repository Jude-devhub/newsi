// 

import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear the session cookie manually — NextAuth stores it as "next-auth.session-token" (JWT mode)
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });

    // Clear cookies set by NextAuth (JWT strategy)
    response.cookies.set("next-auth.session-token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    // Also clear secure cookies (used in production with HTTPS)
    response.cookies.set("__Secure-next-auth.session-token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
      secure: true,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: false, message: "Logout failed" }, { status: 500 });
  }
}
