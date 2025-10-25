"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trophy, Calendar, Activity } from "lucide-react";

interface Match {
  id: number;
  date: string;
  time?: string;
  elapsed?: number;
  home: string;
  away: string;
  goals_home?: number;
  goals_away?: number;
  logo_home: string;
  logo_away: string;
  league_name?: string;
  league_logo?: string;
  country_name?: string;
}

interface TableTeam {
  rank: number;
  team: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
}

const tabs = [
  { label: "Live", icon: <Activity size={16} />, endpoint: "/api/matches/live" },
  { label: "Today", icon: <Calendar size={16} />, endpoint: "/api/matches/schedule" },
  { label: "Upcoming", icon: <ChevronDown size={16} />, endpoint: "/api/matches/upcoming" },
  { label: "Table", icon: <Trophy size={16} />, endpoint: "/api/matches/table" },
];

export default function MatchesTabs() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [matches, setMatches] = useState<Match[]>([]);
  const [table, setTable] = useState<TableTeam[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Record<string, Match[]>>>({});
  const [openLeagues, setOpenLeagues] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  

  async function fetchMatches() {
    setLoading(true);
    try {
      const tab = tabs.find((t) => t.label === activeTab);
      const res = await fetch(tab?.endpoint || "/api/matches/live");
      const data = await res.json();

      if (!data.success) throw new Error("Invalid response");

      if (activeTab === "Table") {
        setTable(data.table || []);
        return;
      }

      const parsed: Match[] = data.live || data.schedule || data.matches || [];

      // 🗓️ Group by Date → League
      if (activeTab !== "Live") {
        const groupedData: Record<string, Record<string, Match[]>> = {};
        parsed.forEach((m) => {
          const dateKey = new Date(m.date).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
          });
          const leagueKey = m.league_name || "Other";

          if (!groupedData[dateKey]) groupedData[dateKey] = {};
          if (!groupedData[dateKey][leagueKey]) groupedData[dateKey][leagueKey] = [];
          groupedData[dateKey][leagueKey].push(m);
        });
        setGrouped(groupedData);
      }

      setMatches(parsed);
    } catch (err) {
      console.error("⚠️ Fetch error:", err);
      setMatches([]);
      setGrouped({});
      setTable([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMatches();
    if (activeTab === "Live") {
      const interval = setInterval(fetchMatches, 180000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const toggleLeague = (key: string) => {
    setOpenLeagues((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-4">
      {/* 🔹 Tabs */}
      <div className="flex justify-around border-b border-gray-200 mb-4">
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setActiveTab(t.label)}
            className={`relative flex items-center gap-1 pb-2 text-sm font-medium transition-all ${
              activeTab === t.label
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon}
            {t.label}
            {activeTab === t.label && (
              <motion.div
                layoutId="underline"
                className="absolute left-0 right-0 bottom-0 h-[2px] bg-blue-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* 🔹 Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {loading ? (
            <p className="text-center text-gray-400 text-sm py-6 animate-pulse">
              Loading {activeTab.toLowerCase()} data...
            </p>
          ) : activeTab === "Table" ? (
            <LeagueTable table={table} />
          ) : matches.length > 0 ? (
            <MatchesContent
              activeTab={activeTab}
              matches={matches}
              grouped={grouped}
              openLeagues={openLeagues}
              toggleLeague={toggleLeague}
            />
          ) : (
            <p className="text-center text-gray-500 text-sm py-6">
              No {activeTab.toLowerCase()} matches found.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------- 📊 League Table ---------------------------- */
function LeagueTable({ table }: { table: TableTeam[] }) {
  if (!table.length)
    return <p className="text-center text-gray-500 text-sm py-6">No table data available.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
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
          {table.map((team) => (
            <tr key={team.rank} className="border-b hover:bg-gray-50 transition">
              <td className="px-3 py-2 text-gray-700">{team.rank}</td>
              <td className="px-3 py-2 flex items-center gap-2">
                <img src={team.logo} alt={team.team} className="w-5 h-5" />
                <span className="font-medium">{team.team}</span>
              </td>
              <td className="text-center">{team.played}</td>
              <td className="text-center">{team.won}</td>
              <td className="text-center">{team.drawn}</td>
              <td className="text-center">{team.lost}</td>
              <td className="text-center font-bold text-blue-600">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------- ⚽ Matches Content --------------------------- */
function MatchesContent({
  activeTab,
  matches,
  grouped,
  openLeagues,
  toggleLeague,
}: any) {
  if (activeTab === "Live") {
    return (
      <div className="divide-y">
        {matches.map((m: Match) => (
          <motion.div key={m.id} layout className="py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 flex-wrap">
                <img src={m.logo_home} alt={m.home} className="w-5 h-5" />
                <span className="font-medium">{m.home}</span>
                <span className="mx-1 font-semibold text-gray-800">
                  {m.goals_home ?? 0} - {m.goals_away ?? 0}
                </span>
                <img src={m.logo_away} alt={m.away} className="w-5 h-5" />
                <span className="font-medium">{m.away}</span>
              </div>
              <div className="text-right text-xs text-red-500 font-semibold">
                🔴 {m.elapsed ?? "--"}'
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1 pl-7">
              {m.league_name} — {m.country_name}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {Object.entries(grouped).map(([date, leagues]) => (
        <div key={date} className="mb-6">
          <h3 className="text-blue-600 font-semibold text-sm mb-3 border-l-4 border-blue-600 pl-2">
            {date}
          </h3>
          {Object.entries(leagues).map(([league, games]) => {
            const first = games[0];
            const leagueKey = `${date}-${league}`;
            const open = openLeagues[leagueKey];

            return (
              <div key={leagueKey} className="mb-2">
                <button
                  onClick={() => toggleLeague(leagueKey)}
                  className="flex justify-between items-center w-full text-left px-2 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-2">
                    <img src={first.league_logo} alt={league} className="w-5 h-5" />
                    <span className="font-medium text-gray-700 text-sm">{league}</span>
                    {first.country_name && (
                      <span className="text-xs text-gray-400">({first.country_name})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{games.length} matches</span>
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pl-4 border-l ml-2 border-gray-200"
                    >
                      {games.map((m) => (
                        <div
                          key={m.id}
                          className="py-2 flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <img src={m.logo_home} alt={m.home} className="w-5 h-5" />
                            <span className="font-medium">{m.home}</span>
                            <span className="text-gray-500 text-sm">vs</span>
                            <img src={m.logo_away} alt={m.away} className="w-5 h-5" />
                            <span className="font-medium">{m.away}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(m.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
