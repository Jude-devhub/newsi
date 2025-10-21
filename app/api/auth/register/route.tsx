import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "@/lib/postgresDb";
 import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (user) {
      return NextResponse.json({ success: true, message: "email already exists" });
    }

    await pool.query(
      "INSERT INTO users (name, email, password, verification_token) VALUES ($1, $2, $3, $4)",
      [name, email, hashed, verificationToken]
    );

    // Send verification email via Resend
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${verificationToken}`;
   
   //send verification email
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "onboarding@resend.dev",
  to: `ojudeee@gmail.com`,
  subject: "Verify your account",
  html: `<p>Click <a href="${verifyUrl}">here</a> to verify your account.</p>`,
});
console.log("Verification email sent to:", email);

// sent verification email

    return NextResponse.json({ success: true, message: "Registration successful. Check your email for verification." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
