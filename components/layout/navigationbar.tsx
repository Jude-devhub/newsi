"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "News", href: "/news" },
    { name: "Entertainment", href: "/entertainment" },
    { name: "Sports", href: "/sports" },
    { name: "Tech", href: "/tech" },
    { name: "Finance", href: "/finance" },
    { name: "Science", href: "/science" },
    { name: "Health", href: "/health" },
    { name: "World", href: "/world" },
  ];

  return (
    <nav className="border-b shadow-sm">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Search className="w-6 h-6 cursor-pointer" />
        </div>

        {/* Logo */}
        <div className="flex items-center font-extrabold text-xl text-black">
          <span>Newsi</span>
          <span className="text-red-600">.</span>
          <span>com</span>
        </div>

        {/* Right: Register + Sign In */}
        <div className="flex items-center gap-4">
          <Link href="/register">
            <button className="bg-gray-500 text-white px-4 py-1 font-semibold rounded">
              Register
            </button>
          </Link>
          
          <Link href="/login">
            <button className="text-black font-medium hover:underline">
              Sign In
            </button>
          </Link>
        </div>
      </div>

      {/* Desktop Navigation (appears on md and above) */}
      <div className="hidden md:flex justify-center gap-2 px-6 py-2 border-t overflow-x-auto whitespace-nowrap">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`pb-1 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-b-2 border-black text-black"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 px-4 pb-4 space-y-2 border-t">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`block transition ${
                  isActive
                    ? "text-black font-semibold"
                    : "text-gray-800 hover:text-black"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
