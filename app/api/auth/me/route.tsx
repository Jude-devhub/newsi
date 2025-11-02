import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { NextAuthOptions, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ✅ Define a type for the API response
interface ApiResponse {
  success: boolean;
  user?: Session["user"];
  message?: string;
}

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const session = await getServerSession(authOptions as NextAuthOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      user: session.user,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
