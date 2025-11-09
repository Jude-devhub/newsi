"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScroll(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200 dark:bg-gray-700">
      <div
        className="h-1 bg-blue-600 dark:bg-blue-400 transition-all duration-100 ease-out"
        style={{ width: `${scroll}%` }}
      />
    </div>
  );
}

export function SmoothScroll() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        const href = (target as HTMLAnchorElement).getAttribute("href");
        if (href && href.startsWith("#")) {
          const el = document.querySelector(href);
          if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ArticleTOCProps {
  headings: Heading[];
}

export function ArticleTOC({ headings }: ArticleTOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      let currentId = "";
      headings.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 80) currentId = id;
      });
      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav className="hidden md:block sticky top-24 max-h-[80vh] overflow-auto px-4">
      <ul className="space-y-1 text-sm">
        {headings.map(({ id, text, level }) => (
          <li key={id} className={`ml-${(level - 1) * 4}`}>
            <a
              href={`#${id}`}
              className={`block transition-colors duration-200 ${
                activeId === id
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {text}
            </a><br />
          </li>
        ))}
      </ul>
    </nav>
  );
}
