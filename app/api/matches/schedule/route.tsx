import { NextResponse } from "next/server";
import { fetchFootballMatches } from "@/lib/fetchFootball";

const fallbackSchedule = [
  {
    id: 2001,
    date: new Date().toISOString(),
    home: "Manchester United",
    away: "Liverpool",
    logo_home: "/default-logo.png",
    logo_away: "/default-logo.png",
    league_name: "Premier League",
    league_logo: "/default-league.png",
    country_name: "England",
  },
];



export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  console.log({ today });
  const endpoint = `https://api.football-data.org/v4/matches?dateFrom=${today}&dateTo=${today}`;

  const schedule = await fetchFootballMatches({
    endpoint,
    cacheKey: "schedule",
    cacheTime: 10 * 60 * 1000, // 10 min
    fallback: fallbackSchedule,
  });

  return NextResponse.json({ success: true, schedule });
}
