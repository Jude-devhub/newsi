"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Match {
  id: number;
  home: string;
  away: string;
  logo_home: string;
  logo_away: string;
  goals_home?: number;
  goals_away?: number;
  elapsed?: number;
  league_name?: string;
  country_name?: string;
}

export default function LiveMatchesTab() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  async function fetchLive(background = false) {
    if (!background) setLoading(true);
    try {
      const res = await fetch("/api/matches/live", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setMatches(data.live || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Live fetch failed:", err);
    } finally {
      if (!background) setLoading(false);
    }
  }

  useEffect(() => {
    fetchLive();
    const interval = setInterval(() => fetchLive(true), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="divide-y">
      {loading ? (
        <p className="text-center text-gray-400 py-6 animate-pulse">
          Loading live matches...
        </p>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No live matches found.</p>
      ) : (
        matches.map((m) => (
          <motion.div key={m.id} layout className="py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 flex-wrap">
                <img src={m.logo_home} className="w-5 h-5" />
                <span>{m.home}</span>
                <span className="font-semibold">{m.goals_home ?? 0} - {m.goals_away ?? 0}</span>
                <img src={m.logo_away} className="w-5 h-5" />
                <span>{m.away}</span>
              </div>
              <motion.span
                className="text-red-600 text-xs font-semibold"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🔴 {m.elapsed ?? "--"}'
              </motion.span>
            </div>
            <div className="text-xs text-gray-500 pl-7">{m.league_name} — {m.country_name}</div>
          </motion.div>
        ))
      )}

      {lastUpdated && (
        <AnimatePresence>
          <motion.p
            key={lastUpdated}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-center text-gray-400 mt-2"
          >
            Last updated • {lastUpdated}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  );
}
