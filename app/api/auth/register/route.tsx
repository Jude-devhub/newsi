import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "@/lib/postgresDb";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await pool.query(
      "INSERT INTO users (name, email, password, verification_token) VALUES ($1, $2, $3, $4)",
      [name, email, hashed, verificationToken]
    );

    // Send verification email via Resend
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${verificationToken}`;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify your email - Newsi",
        text: `Hi ${name}, please verify your email by clicking the link: ${verifyUrl}`,
      }),
    });

    return NextResponse.json({ success: true, message: "Registration successful. Check your email for verification." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
