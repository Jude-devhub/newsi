"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Newspaper, ChevronDown, LogOut, User, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ✅ Fetch user info from /api/auth/me
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error("User fetch failed:", err);
      }
    };
    fetchUser();
  }, []);

  // ✅ Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  if (!user) {
    // 🚪 Not logged in — show Register / Sign In buttons
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/register"
          className="px-6 py-2 w-full sm:w-auto text-center font-semibold text-white rounded-lg 
          bg-gradient-to-r from-blue-600 to-blue-500 
          hover:from-blue-700 hover:to-blue-600 
          active:scale-95 transition-all duration-200 
          shadow-md hover:shadow-blue-400/50"
        >
          Register
        </Link>

        <Link
          href="/login"
          className="px-6 py-2 w-full sm:w-auto text-center 
          text-gray-800 font-medium rounded 
          hover:text-blue-600 hover:underline 
          active:scale-95 transition-all duration-200"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // ✅ Logged in — show name, icon, dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 
        active:scale-95 transition-all"
      >
        <Newspaper className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-gray-800">{user.name.split(" ")[0]}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-100 z-50
          animate-in fade-in slide-in-from-top-2"
        >
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition"
            onClick={() => setOpen(false)}
          >
            <User className="w-4 h-4 text-gray-600" />
            Profile
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition"
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4 text-gray-600" />
            Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
