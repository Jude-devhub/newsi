"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, X } from "lucide-react";

interface Match {
  id: number;
  date: string;
  home: string;
  away: string;
  logo_home: string;
  logo_away: string;
  league_name: string;
  league_logo: string;
  country_name: string;
}

export default function ScheduleMatchesTab() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Match[]>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [showUpdatedToast, setShowUpdatedToast] = useState(false);

  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  async function loadMatches(isBackground = false) {
    try {
      if (!isBackground) setLoading(true);

      const res = await fetch("/api/matches/upcoming", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error("Failed to load matches");

      const newMatches: Match[] = data.matches || [];

      // Prevent flicker if same data
      if (JSON.stringify(newMatches) !== JSON.stringify(matches)) {
        const groupedByLeague: Record<string, Match[]> = {};
        newMatches.forEach((m) => {
          const key = m.league_name || "Other";
          if (!groupedByLeague[key]) groupedByLeague[key] = [];
          groupedByLeague[key].push(m);
        });

        setMatches(newMatches);
        setGrouped(groupedByLeague);
        setLastUpdated(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setShowUpdatedToast(true);
        setTimeout(() => setShowUpdatedToast(false), 3000);
      }
      setError(null);
    } catch (err) {
      console.error("⚠️ Error fetching matches:", err);
      setError("Unable to refresh upcoming matches.");
    } finally {
      if (!isBackground) setLoading(false);
    }
  }

  useEffect(() => {
    loadMatches();
    refreshInterval.current = setInterval(() => loadMatches(true), 300000);
    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-400 py-6 animate-pulse text-sm sm:text-base">
        Loading upcoming matches...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 py-6 text-sm sm:text-base">
        {error}
      </p>
    );
  if (!matches.length)
    return (
      <p className="text-center text-gray-500 py-6 text-sm sm:text-base">
        No upcoming matches found.
      </p>
    );

  return (
    <div className="relative space-y-3 sm:space-y-4 px-2 sm:px-4">
      {/* 🔄 Toast Notification (tap to dismiss) */}
      <AnimatePresence>
        {showUpdatedToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowUpdatedToast(false)}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs sm:text-sm px-4 py-2 rounded-full shadow-md z-50 cursor-pointer flex items-center gap-2"
          >
            <span>🔄 Updated • {lastUpdated}</span>
            <X size={12} className="opacity-70 hover:opacity-100 transition" />
          </motion.div>
        )}
      </AnimatePresence>

      {Object.entries(grouped).map(([league, games]) => {
        const first = games[0];
        const isOpen = open[league];
        return (
          <div
            key={league}
            className="border rounded-lg overflow-hidden bg-white shadow-sm"
          >
            {/* League Header */}
            <button
              onClick={() => setOpen((p) => ({ ...p, [league]: !p[league] }))}
              className="flex justify-between w-full px-3 py-2 sm:py-3 bg-gray-50 hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center gap-2 text-sm sm:text-base truncate">
                <img
                  src={first.league_logo || "/default-league.png"}
                  alt={league}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded"
                />
                <span className="font-medium truncate max-w-[130px] sm:max-w-none">
                  {league}
                </span>
                <span className="text-[11px] sm:text-xs text-gray-400">
                  ({first.country_name})
                </span>
              </div>
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* League Matches */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pl-3 sm:pl-4 border-l border-gray-200 ml-2 bg-white"
                >
                  {games.map((m) => (
                    <div
                      key={m.id}
                      className="py-2 flex flex-wrap sm:flex-nowrap justify-between items-center border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2 text-sm sm:text-base flex-wrap">
                        <div className="flex items-center gap-2 min-w-[120px] sm:min-w-0">
                          <img
                            src={m.logo_home || "/default-logo.png"}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded"
                            alt={m.home}
                          />
                          <span className="truncate max-w-[90px] sm:max-w-none">
                            {m.home}
                          </span>
                        </div>

                        <span className="text-gray-500 text-xs sm:text-sm">
                          vs
                        </span>

                        <div className="flex items-center gap-2 min-w-[120px] sm:min-w-0">
                          <img
                            src={m.logo_away || "/default-logo.png"}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded"
                            alt={m.away}
                          />
                          <span className="truncate max-w-[90px] sm:max-w-none">
                            {m.away}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] sm:text-xs text-gray-500 mt-1 sm:mt-0 whitespace-nowrap px-2 py-1 rounded-md bg-gray-50">
                        {new Date(m.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        {new Date(m.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
