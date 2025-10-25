import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ⚽ Mock league table data (you can replace with a real API later)
    const table = [
      {
        rank: 1,
        team: "Manchester City",
        logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
        played: 10,
        won: 8,
        drawn: 1,
        lost: 1,
        points: 25,
      },
      {
        rank: 2,
        team: "Arsenal",
        logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
        played: 10,
        won: 7,
        drawn: 2,
        lost: 1,
        points: 23,
      },
      {
        rank: 3,
        team: "Liverpool",
        logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
        played: 10,
        won: 7,
        drawn: 1,
        lost: 2,
        points: 22,
      },
      {
        rank: 4,
        team: "Tottenham Hotspur",
        logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
        played: 10,
        won: 6,
        drawn: 3,
        lost: 1,
        points: 21,
      },
      {
        rank: 5,
        team: "Aston Villa",
        logo: "https://upload.wikimedia.org/wikipedia/en/9/9f/Aston_Villa_FC_crest_%282016%29.svg",
        played: 10,
        won: 6,
        drawn: 1,
        lost: 3,
        points: 19,
      },
      {
        rank: 6,
        team: "Manchester United",
        logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
        played: 10,
        won: 6,
        drawn: 0,
        lost: 4,
        points: 18,
      },
      {
        rank: 7,
        team: "Newcastle United",
        logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
        played: 10,
        won: 5,
        drawn: 2,
        lost: 3,
        points: 17,
      },
      {
        rank: 8,
        team: "Brighton",
        logo: "https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg",
        played: 10,
        won: 5,
        drawn: 1,
        lost: 4,
        points: 16,
      },
      {
        rank: 9,
        team: "Chelsea",
        logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
        played: 10,
        won: 4,
        drawn: 2,
        lost: 4,
        points: 14,
      },
      {
        rank: 10,
        team: "West Ham United",
        logo: "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg",
        played: 10,
        won: 4,
        drawn: 1,
        lost: 5,
        points: 13,
      },
    ];

    return NextResponse.json({
      success: true,
      table,
      updated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error fetching league table:", error);
    return NextResponse.json({ success: false, error: "Failed to load table" }, { status: 500 });
  }
}
