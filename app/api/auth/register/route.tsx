import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "@/lib/postgresDb";
import { sendVerificationEmail } from "@/lib/sendEmail";

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
      return NextResponse.json({message: `Email already exists! Login instead.` }, { status: 400 });
    }

    await pool.query(
      "INSERT INTO users (name, email, password, verification_token) VALUES ($1, $2, $3, $4)",
      [name, email, hashed, verificationToken]
    );

    // Send verification email via Resend
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${verificationToken}`;



    await sendVerificationEmail(email, name, verifyUrl);

    return NextResponse.json({ success: true, message: "Registration successful. Check your email for verification." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
