"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("⏳ Logging in...");
    setLoading(true);

    const {email, password} = form;

    try {
        const res = await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/dashboard", // redirect after success
    });

    console.log("Sign in result:", res);

      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });

     
    } catch (error) {
      console.error(error);
      setMessage("❌ Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading}
            className={`w-full text-white font-semibold py-2 rounded-lg transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
        )}

        {/* Forgot Password + Sign Up */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <Link
            href="/forgot-password"
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
          <br />
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* 🌐 Social Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-xl mr-2" />
            <span className="font-medium text-gray-700">
              Continue with Google
            </span>
          </button>

          <button
            onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <FaApple className="text-2xl text-gray-800 mr-2" />
            <span className="font-medium text-gray-700">
              Continue with Apple
            </span>
          </button>

          <button
            onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <FaFacebook className="text-xl text-blue-600 mr-2" />
            <span className="font-medium text-gray-700">
              Continue with Facebook
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
