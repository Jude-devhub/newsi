import { NextResponse } from "next/server";

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

const API_KEY = process.env.FOOTBALL_DATA_KEY;
const API_BASE = "https://api.football-data.org/v4/competitions";

const COMPETITIONS = [
  { code: "PL", name: "Premier League", country: "England" },
  { code: "PD", name: "La Liga", country: "Spain" },
  { code: "SA", name: "Serie A", country: "Italy" },
  { code: "BL1", name: "Bundesliga", country: "Germany" },
  { code: "FL1", name: "Ligue 1", country: "France" },
];

// 🧠 In-memory cache
let cache: {
  data: LeagueTable[] | null;
  timestamp: number;
} = { data: null, timestamp: 0 };

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// 🏆 Fetch standings for all competitions
async function fetchAllStandings(): Promise<LeagueTable[]> {
  const results: LeagueTable[] = [];

  await Promise.all(
    COMPETITIONS.map(async ({ code, name, country }) => {
      try {
        const res = await fetch(`${API_BASE}/${code}/standings`, {
          headers: { "X-Auth-Token": API_KEY },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`${name} failed: ${res.statusText}`);
        const data = await res.json();

        const table = data.standings?.[0]?.table || [];
        const teams: LeagueTeam[] = table.map((t: any) => ({
          rank: t.position,
          team: t.team.name,
          logo: t.team.crest,
          played: t.playedGames,
          won: t.won,
          drawn: t.draw,
          lost: t.lost,
          points: t.points,
        }));

        results.push({
          league: name,
          country,
          teams,
        });
      } catch (err) {
        console.error(`⚠️ Error fetching ${name}:`, err);
      }
    })
  );

  return results;
}

export async function GET() {
  const now = Date.now();

  // ✅ Serve from cache if still valid
  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    console.log("✅ Serving league tables from cache");

    // 🔄 Trigger background refresh (non-blocking)
    fetchAllStandings()
      .then((fresh) => {
        if (fresh.length > 0) {
          cache = { data: fresh, timestamp: Date.now() };
          console.log("🔄 Background cache updated successfully");
        }
      })
      .catch((err) => console.error("⚠️ Background update failed:", err));

    return NextResponse.json({
      success: true,
      leagues: cache.data,
      cached: true,
      fetchedAt: new Date(cache.timestamp).toISOString(),
    });
  }

  // 🌍 No cache or expired — fetch new data now
  console.log("🌍 Fetching fresh league tables...");
  try {
    const leagues = await fetchAllStandings();

    if (leagues.length > 0) {
      cache = { data: leagues, timestamp: now };
    }

    return NextResponse.json({
      success: true,
      leagues,
      cached: false,
      fetchedAt: new Date(now).toISOString(),
    });
  } catch (error) {
    console.error("❌ Error fetching standings:", error);

    // 🟡 Use cached version if available
    if (cache.data) {
      return NextResponse.json({
        success: true,
        leagues: cache.data,
        cached: true,
        fallback: true,
        fetchedAt: new Date(cache.timestamp).toISOString(),
      });
    }

    return NextResponse.json(
      { success: false, error: "Failed to load league tables" },
      { status: 500 }
    );
  }
}
