import { NextResponse } from "next/server";
import { fetchFootballMatches } from "@/lib/fetchFootball";

const fallbackUpcoming = [
  {
    id: 3001,
    date: new Date(Date.now() + 86400000).toISOString(),
    home: "Inter Milan",
    away: "AC Milan",
    logo_home: "/default-logo.png",
    logo_away: "/default-logo.png",
    league_name: "Serie A",
    league_logo: "/default-league.png",
    country_name: "Italy",
  },
];




export async function GET() {
  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const to = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

    console.log({ from, to }, today.toISOString().slice(0, 10));

  const endpoint = `https://api.football-data.org/v4/matches?dateFrom=${from}&dateTo=${to}`;

  const matches = await fetchFootballMatches({
    endpoint,
    cacheKey: "upcoming",
    cacheTime: 60 * 60 * 1000, // 1 hour
    fallback: fallbackUpcoming,
  });

  return NextResponse.json({ success: true, matches });
}
