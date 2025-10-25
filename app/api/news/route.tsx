import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/fetchNews";
import { getUserCountry } from "@/lib/getUserCountry";

export async function GET() {
  try {
    console.log("🟩 NEWS API ROUTE HIT");
    const country = await getUserCountry();
    const articles = await fetchNews(country || "Nigeria");
    return NextResponse.json({ message: "Hello from the news API!", articles});
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
