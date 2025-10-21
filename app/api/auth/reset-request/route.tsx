import { NextResponse } from "next/server";
import crypto from "crypto";
import pool from "@/lib/postgresDb";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return NextResponse.json({ message: "If that email exists, a reset link will be sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    await pool.query("UPDATE users SET reset_token = $1 WHERE email = $2", [resetToken, email]);

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password - Newsi",
        text: `Click here to reset your password: ${resetUrl}`,
      }),
    });

    return NextResponse.json({ success: true, message: "Password reset link sent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
