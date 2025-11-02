"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trophy } from "lucide-react";

interface LeagueTeam {
  rank: number;
  team: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
}

interface LeagueTable {
  league: string;
  country: string;
  teams: LeagueTeam[];
}

export default function TableTab() {
  const [leagues, setLeagues] = useState<LeagueTable[]>([]);
  const [openLeague, setOpenLeague] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const toggleLeague = (league: string) => {
    setOpenLeague((prev) => (prev === league ? null : league));
  };

  async function fetchTable() {
    setLoading(true);
    try {
      const res = await fetch("/api/matches/table", { cache: "no-store" });
      const data = await res.json();

      if (!data.success) throw new Error("Failed to load table");

      setLeagues(data.leagues || []);
      setLastUpdated(
        new Date(data.fetchedAt || Date.now()).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (err) {
      console.error("❌ Error fetching tables:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTable();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-400 text-sm py-6 animate-pulse">
        Loading league tables...
      </p>
    );

  if (!leagues.length)
    return (
      <p className="text-center text-gray-500 text-sm py-6">
        No table data available.
      </p>
    );

  return (
    <div className="space-y-4">
      {leagues.map((league) => {
        const isOpen = openLeague === league.league;
        return (
          <div
            key={league.league}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            {/* League header */}
            <button
              onClick={() => toggleLeague(league.league)}
              className="w-full flex justify-between items-center px-4 py-3 bg-blue-50 hover:bg-blue-100 transition text-left"
            >
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-blue-600" />
                <span className="font-semibold text-blue-700">
                  {league.league}
                </span>
                <span className="text-xs text-gray-500">
                  ({league.country})
                </span>
              </div>
              {isOpen ? (
                <ChevronUp size={18} className="text-gray-600" />
              ) : (
                <ChevronDown size={18} className="text-gray-600" />
              )}
            </button>

            {/* Collapsible body */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                        <tr>
                          <th className="px-3 py-2 text-left">#</th>
                          <th className="px-3 py-2 text-left">Team</th>
                          <th className="px-3 py-2 text-center">P</th>
                          <th className="px-3 py-2 text-center">W</th>
                          <th className="px-3 py-2 text-center">D</th>
                          <th className="px-3 py-2 text-center">L</th>
                          <th className="px-3 py-2 text-center">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {league.teams.map((team) => (
                          <tr
                            key={team.rank}
                            className="border-b hover:bg-gray-50 transition"
                          >
                            <td className="px-3 py-2 text-gray-700">
                              {team.rank}
                            </td>
                            <td className="px-3 py-2 flex items-center gap-2">
                              <img
                                src={team.logo}
                                alt={team.team}
                                className="w-5 h-5"
                              />
                              <span className="font-medium">{team.team}</span>
                            </td>
                            <td className="text-center">{team.played}</td>
                            <td className="text-center">{team.won}</td>
                            <td className="text-center">{team.drawn}</td>
                            <td className="text-center">{team.lost}</td>
                            <td className="text-center font-bold text-blue-600">
                              {team.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* 🕒 Last updated */}
      {lastUpdated && (
        <p className="text-center text-xs text-gray-400 mt-2">
          Last updated • {lastUpdated}
        </p>
      )}
    </div>
  );
}
