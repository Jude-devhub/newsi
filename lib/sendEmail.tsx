// lib/mail.ts
import nodemailer from "nodemailer";

/**
 * Sends contact form email using Yahoo Mail SMTP
 */
export async function sendContactEmail(
  name: string,
  email: string,
  message: string
) {
  try {
    // Configure Yahoo SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "yahoo",
      auth: {
        user: process.env.YAHOO_USER, // e.g. yourname@yahoo.com
        pass: process.env.YAHOO_PASS, // your Yahoo app password
      },
    });

    // Send the mail
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.YAHOO_USER}>`,
      to: "judeokechukwuogbonna@gmail.com", // receiver (e.g. your admin inbox)
      subject: `📩 New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;">
          <h3>📬 New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong><br/>${message}</p>
          <hr/>
          <small>This email was sent via your Next.js Yahoo Mail module.</small>
        </div>
      `,
    });

    console.log("✅ Yahoo email sent:", info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Yahoo email send error:", error);
    return { success: true, error: error.message };
  }
}

/**
 * Sends verification email via Yahoo
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verifyUrl: string
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "yahoo",
      auth: {
        user: process.env.YAHOO_USER,
        pass: process.env.YAHOO_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.YAHOO_USER}>`,
      to: email,
      subject: "Verify your account",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;">
          <h2>Hello ${name},</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <p>
            <a href="${verifyUrl}"
               style="display:inline-block;background:#007bff;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
              Verify Email
            </a>
          </p>
          <p>If you didn’t request this, you can ignore this message.</p>
        </div>
      `,
    });

    console.log("✅ Verification email sent:", info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Verification email error:", error);
    return { success: true, error: error.message };
  }
}
