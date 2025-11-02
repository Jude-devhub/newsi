"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("⏳ Registering...");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message || `An error occurred. ${data.error}`);

      if (res.ok) {
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
        )}

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* 🌐 Social Signup Buttons (NextAuth) */}
        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <FcGoogle className="mr-2 text-xl" />
            <span className="font-medium text-gray-700">
              Continue with Google
            </span>
          </button>

          <button
            onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <FaApple className="mr-2 text-2xl text-gray-800" />
            <span className="font-medium text-gray-700">
              Continue with Apple
            </span>
          </button>

          <button
            onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <FaFacebook className="mr-2 text-xl text-blue-600" />
            <span className="font-medium text-gray-700">
              Continue with Facebook
            </span>
          </button>
        </div>

        {/* Links */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
          <br />
          <Link
            href="/forgot-password"
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
