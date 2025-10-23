"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBox() {
  const [showInput, setShowInput] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search/${encodeURIComponent(query)}`);
      setShowInput(false);
      setQuery("");
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Search Icon */}
      <Search
        className="w-6 h-6 cursor-pointer text-gray-700 hover:text-blue-600 
        transition-transform hover:scale-110"
        onClick={() => setShowInput((prev) => !prev)}
      />

      {/* Animated Search Input */}
      <AnimatePresence>
        {showInput && (
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "12rem" }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              placeholder="Search..."
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              transition-all duration-200 w-full"
            />
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
