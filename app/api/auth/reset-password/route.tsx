import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/postgresDb";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await pool.query("SELECT * FROM users WHERE reset_token = $1", [token]);
    if (user.rows.length === 0) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password = $1, reset_token = NULL WHERE reset_token = $2", [hashed, token]);

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
