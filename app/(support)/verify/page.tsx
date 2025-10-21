"use client";

import { useEffect, useState } from "react";

export default function VerifyPage() {
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("Invalid or missing verification token.");
        return;
      }

      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);
        const data = await res.json();

        if (data.success) {
          setStatus("✅ Your email has been verified successfully! You can now log in.");
        } else {
          setStatus(`❌ Verification failed: ${data.message}`);
        }
      } catch {
        setStatus("⚠️ Network error. Please try again later.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center w-96">
        <h2 className="text-xl font-semibold mb-2">Email Verification</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}
