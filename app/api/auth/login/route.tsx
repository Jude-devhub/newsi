import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/postgresDb";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // ✅ You can set cookies/session here if needed

    return NextResponse.json({ success: true, message: "Login successful", user });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
