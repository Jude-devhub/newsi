import nodemailer from "nodemailer";

/** ✅ Shared Yahoo SMTP transporter */
const transporter = nodemailer.createTransport({
  service: "yahoo",
  auth: {
    user: process.env.YAHOO_USER, // your Yahoo email
    pass: process.env.YAHOO_PASS, // your Yahoo app password
  },
});

/**
 * 📬 Send contact form message to admin
 */
export async function sendContactEmail(
  name: string,
  email: string,
  message: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.YAHOO_USER}>`,
      to: "judeokechukwuogbonna@gmail.com",
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

    console.log("✅ Contact email sent:", info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Contact email error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * ✉️ Send verification email after user registers
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verifyUrl: string
) {
  try {
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
          <p>If you didn’t request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ Verification email sent:", info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Verification email error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 🔑 Send password reset email when user clicks "Forgot Password"
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.YAHOO_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;">
          <h2>Hello ${name},</h2>
          <p>We received a request to reset your password.</p>
          <p>
            <a href="${resetUrl}"
               style="display:inline-block;background:#28a745;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
              Reset Password
            </a>
          </p>
          <p>This link will expire in <strong>1 hour</strong> for your security.</p>
          <p>If you didn’t request a password reset, please ignore this email.</p>
          <hr/>
          <small>Sent securely via Yahoo SMTP.</small>
        </div>
      `,
    });

    console.log("✅ Password reset email sent:", info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Password reset email error:", error);
    return { success: false, error: error.message };
  }
}
