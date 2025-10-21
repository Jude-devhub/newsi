import { NextResponse } from "next/server";
import pool from "@/lib/postgresDb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const user = await pool.query("SELECT * FROM users WHERE verification_token = $1", [token]);
    if (user.rows.length === 0) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    await pool.query("UPDATE users SET verified = true, verification_token = NULL WHERE verification_token = $1", [token]);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?verified=true`);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
