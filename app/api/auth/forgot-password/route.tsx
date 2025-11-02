import { NextResponse } from "next/server";
import crypto from "crypto";
import pool from "@/lib/postgresDb";
import { sendPasswordResetEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour expiry

    await pool.query(
      "UPDATE users SET reset_token = $1, reset_expires = $2 WHERE email = $3",
      [token, expires, email]
    );

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, user.name, resetUrl);

    return NextResponse.json({ message: "✅ Password reset link sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Error sending reset link" }, { status: 500 });
  }
}
