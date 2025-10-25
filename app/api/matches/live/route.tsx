import { NextResponse } from "next/server";
import { fetchFootballMatches } from "@/lib/fetchFootball";

const fallbackLive = [
  {
    id: 1001,
    date: new Date().toISOString(),
    elapsed: 67,
    home: "Arsenal",
    away: "Chelsea",
    goals_home: 1,
    goals_away: 1,
    logo_home: "/default-logo.png",
    logo_away: "/default-logo.png",
    league_name: "Premier League",
    league_logo: "/default-league.png",
    country_name: "England",
  },
];




export async function GET() {
  const endpoint = "https://api.football-data.org/v4/matches?status=LIVE";

  const live = await fetchFootballMatches({
    endpoint,
    cacheKey: "live",
    cacheTime: 60 * 1000, // 1 min
    fallback: fallbackLive,
  });

  console.log({ live });

  return NextResponse.json({ success: true, live });
}
