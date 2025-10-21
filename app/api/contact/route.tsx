import { NextResponse } from "next/server";
import { Resend } from "resend";
import pool from "@/lib/postgresDb"; // ✅ Import pool directly

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Ensure table exists (for first-time setup)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // ✅ Insert message into PostgreSQL
    await pool.query(
      `INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)`,
      [name, email, message]
    );

    // ✅ Send confirmation email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "onboarding@resend.dev", // ✅ Must be a verified sender
      to: "judeokechukwuogbonna@gmail.com",
      subject: `📩 New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    return NextResponse.json({
      success: true,
      message: "Message saved & email sent successfully ✅",
    });
  } catch (error) {
    console.error("❌ Error saving contact or sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process contact form" },
      { status: 500 }
    );
  }
}
