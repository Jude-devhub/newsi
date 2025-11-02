"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

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

  useEffect(() => {
    fetch("/api/matches/schedule")
      .then((r) => r.json())
      .then((data) => {
        setMatches(data.schedule || []);
        const groupedByLeague: Record<string, Match[]> = {};
        data.schedule?.forEach((m: Match) => {
          const key = m.league_name || "Other";
          if (!groupedByLeague[key]) groupedByLeague[key] = [];
          groupedByLeague[key].push(m);
        });
        setGrouped(groupedByLeague);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-400 py-6 animate-pulse">
        Loading matches...
      </p>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {Object.entries(grouped).map(([league, games]) => {
        const first = games[0];
        const isOpen = open[league];
        return (
          <div
            key={league}
            className="border border-gray-100 rounded-lg overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpen((p) => ({ ...p, [league]: !p[league] }))}
              className="flex justify-between w-full px-3 py-3 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <img
                  src={first.league_logo || "/default-league.png"}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded"
                  alt=""
                />
                <span className="font-medium truncate max-w-[120px] sm:max-w-none">
                  {league}
                </span>
                <span className="text-xs text-gray-400 hidden sm:inline">
                  ({first.country_name})
                </span>
              </div>
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="divide-y divide-gray-100 bg-white"
                >
                  {games.map((m) => (
                    <div
                      key={m.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-3 py-2 text-sm sm:text-base"
                    >
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-700">
                        <div className="flex items-center gap-1">
                          <img
                            src={m.logo_home || "/default-logo.png"}
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            alt={m.home}
                          />
                          <span className="truncate max-w-[90px] sm:max-w-none">
                            {m.home}
                          </span>
                        </div>

                        <span className="text-gray-500 text-xs sm:text-sm">vs</span>

                        <div className="flex items-center gap-1">
                          <img
                            src={m.logo_away || "/default-logo.png"}
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            alt={m.away}
                          />
                          <span className="truncate max-w-[90px] sm:max-w-none">
                            {m.away}
                          </span>
                        </div>
                      </div>

                      {/* 🔵 Time Badge */}
                      <span className="text-[11px] sm:text-sm text-white bg-blue-600 px-2.5 py-1 rounded-full mt-2 sm:mt-0 self-start sm:self-center whitespace-nowrap shadow-sm">
                        {new Date(m.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
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
