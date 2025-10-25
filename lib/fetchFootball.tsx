// lib/fetchFootball.ts
export interface MatchData {
  id: number;
  date: string;
  elapsed?: number;
  home: string;
  away: string;
  goals_home?: number;
  goals_away?: number;
  logo_home: string;
  logo_away: string;
  league_name: string;
  league_logo: string;
  country_name: string;
}

interface CacheStore {
  timestamp: number;
  data: MatchData[];
}

const cacheStore: Record<string, CacheStore> = {};

export async function fetchFootballMatches({
  endpoint,
  cacheKey,
  cacheTime = 60 * 1000,
  fallback,
}: {
  endpoint: string;
  cacheKey: string;
  cacheTime?: number;
  fallback: MatchData[];
}): Promise<MatchData[]> {
  const now = Date.now();
  const cache = cacheStore[cacheKey];

  // 🧩 Return cache if valid
  if (cache && now - cache.timestamp < cacheTime) {
    return cache.data;
  }

  const FOOTBALL_DATA_KEY = process.env.FOOTBALL_DATA_KEY;
  if (!FOOTBALL_DATA_KEY) {
    console.warn("⚠️ FOOTBALL_DATA_KEY missing");
    return fallback;
  }

  try {
    const res = await fetch(endpoint, {
      headers: { "X-Auth-Token": FOOTBALL_DATA_KEY },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);

    const data = await res.json();
    const matches = (data.matches || []).map((m: any) => ({
      id: m.id,
      date: m.utcDate,
      elapsed: m.minute || 0,
      home: m.homeTeam.name,
      away: m.awayTeam.name,
      goals_home: m.score?.fullTime?.home ?? null,
      goals_away: m.score?.fullTime?.away ?? null,
      logo_home: m.homeTeam.crest || "/default-logo.png",
      logo_away: m.awayTeam.crest || "/default-logo.png",
      league_name: m.competition.name,
      league_logo: m.competition.emblem || "/default-league.png",
      country_name: m.area.name,
    }));

    cacheStore[cacheKey] = { timestamp: now, data: matches };
    return matches;
  } catch (err) {
    console.warn(`⚠️ Fetch error [${cacheKey}]:`, (err as Error).message);
    return cache?.data?.length ? cache.data : fallback;
  }
}
