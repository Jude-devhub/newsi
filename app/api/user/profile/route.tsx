import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/postgresDb";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

export async function GET(req: Request) {
  try {
    // 🍪 Extract token from cookies
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // 🔐 Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

    // 🔍 Fetch user details from DB (optional)
    const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [
      (decoded as any).id,
    ]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Return user profile
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile Route Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
