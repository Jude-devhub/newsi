"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      setError(err.message || "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-6 text-lg text-gray-700">
        Have feedback, suggestions, or partnership inquiries? We’d love to hear from you!  
        Fill out the form below and we’ll get back to you as soon as possible.
      </p>

      {submitted ? (
        <p className="text-green-600 font-medium">
          ✅ Thank you! Your message has been sent.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            ></textarea>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-2">Other ways to reach us</h2>
        <p className="text-gray-700">
          📧 Email:{" "}
          <a href="mailto:judeokechukwuogbonna@gmail.com" className="text-blue-600 underline">
            judeokechukwuogbonna@gmail.com
          </a>
          <br />
          📞 Phone:{" "}
          <a href="tel:+2347062943561" className="text-blue-600 underline">
            +234 706 294 3561
          </a>
        </p>
      </div>
    </main>
  );
}
