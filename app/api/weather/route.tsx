import { NextResponse } from "next/server";

// 🕒 Cache for 2 hours (in seconds)
export const revalidate = 7200;

// 🧠 In-memory cache
let cachedData: any[] | null = null;
let lastFetched = 0;

// 🌍 City list
const fallbackCities = [
  // 🇳🇬 Nigeria
  { region: "Nigeria", name: "Lagos", lat: 6.5244, lon: 3.3792 },
  { region: "Nigeria", name: "Abuja", lat: 9.0765, lon: 7.3986 },
  { region: "Nigeria", name: "Port Harcourt", lat: 4.8156, lon: 7.0498 },
  { region: "Nigeria", name: "Kano", lat: 12.0022, lon: 8.5919 },
  { region: "Nigeria", name: "Ibadan", lat: 7.3775, lon: 3.947 },
  { region: "Nigeria", name: "Benin City", lat: 6.3382, lon: 5.6257 },
  { region: "Nigeria", name: "Maiduguri", lat: 11.8333, lon: 13.15 },
  { region: "Nigeria", name: "Zaria", lat: 11.1113, lon: 7.7228 },
  { region: "Nigeria", name: "Jos", lat: 9.8965, lon: 8.8583 },
  { region: "Nigeria", name: "Ilorin", lat: 8.5, lon: 4.55 },
  { region: "Nigeria", name: "Abeokuta", lat: 7.1607, lon: 3.35 },
  { region: "Nigeria", name: "Enugu", lat: 6.4403, lon: 7.4948 },
  { region: "Nigeria", name: "Calabar", lat: 4.9591, lon: 8.3269 },

  // 🌍 Africa
  { region: "Africa", name: "Cairo", lat: 30.0444, lon: 31.2357 },
  { region: "Africa", name: "Nairobi", lat: -1.2921, lon: 36.8219 },
  { region: "Africa", name: "Johannesburg", lat: -26.2041, lon: 28.0473 },
  { region: "Africa", name: "Accra", lat: 5.6037, lon: -0.187 },
  { region: "Africa", name: "Casablanca", lat: 33.5731, lon: -7.5898 },
  { region: "Africa", name: "Addis Ababa", lat: 9.145, lon: 40.4897 },
  { region: "Africa", name: "Tunis", lat: 36.8065, lon: 10.1815 },

  // 🌎 North America
  { region: "North America", name: "New York", lat: 40.7128, lon: -74.006 },
  { region: "North America", name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { region: "North America", name: "Toronto", lat: 43.65107, lon: -79.347015 },
  { region: "North America", name: "Chicago", lat: 41.8781, lon: -87.6298 },
  { region: "North America", name: "Mexico City", lat: 19.4326, lon: -99.1332 },
  { region: "North America", name: "Houston", lat: 29.7604, lon: -95.3698 },
  { region: "North America", name: "Vancouver", lat: 49.2827, lon: -123.1207 },
  { region: "North America", name: "Miami", lat: 25.7617, lon: -80.1918 },

  // 🌍 Europe
  { region: "Europe", name: "London", lat: 51.5074, lon: -0.1278 },
  { region: "Europe", name: "Paris", lat: 48.8566, lon: 2.3522 },
  { region: "Europe", name: "Berlin", lat: 52.52, lon: 13.405 },
  { region: "Europe", name: "Madrid", lat: 40.4168, lon: -3.7038 },
  { region: "Europe", name: "Rome", lat: 41.9028, lon: 12.4964 },
  { region: "Europe", name: "Amsterdam", lat: 52.3676, lon: 4.9041 },
  { region: "Europe", name: "Vienna", lat: 48.2082, lon: 16.3738 },
  { region: "Europe", name: "Zurich", lat: 47.3769, lon: 8.5417 },
  { region: "Europe", name: "Oslo", lat: 59.9139, lon: 10.7522 },
  { region: "Europe", name: "Stockholm", lat: 59.3293, lon: 18.0686 },

  // 🌏 Asia
  { region: "Asia", name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { region: "Asia", name: "Beijing", lat: 39.9042, lon: 116.4074 },
  { region: "Asia", name: "New Delhi", lat: 28.6139, lon: 77.209 },
  { region: "Asia", name: "Singapore", lat: 1.3521, lon: 103.8198 },
  { region: "Asia", name: "Bangkok", lat: 13.7563, lon: 100.5018 },
  { region: "Asia", name: "Seoul", lat: 37.5665, lon: 126.978 },
  { region: "Asia", name: "Kuala Lumpur", lat: 3.139, lon: 101.6869 },
  { region: "Asia", name: "Manila", lat: 14.5995, lon: 120.9842 },
  { region: "Asia", name: "Dubai", lat: 25.276987, lon: 55.296249 },
  { region: "Asia", name: "Jakarta", lat: -6.2088, lon: 106.8456 },

  // 🌎 South America
  { region: "South America", name: "São Paulo", lat: -23.5505, lon: -46.6333 },
  { region: "South America", name: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
  { region: "South America", name: "Lima", lat: -12.0464, lon: -77.0428 },
  { region: "South America", name: "Santiago", lat: -33.4489, lon: -70.6693 },
  { region: "South America", name: "Bogotá", lat: 4.711, lon: -74.0721 },
  { region: "South America", name: "Caracas", lat: 10.4806, lon: -66.9036 },

  // 🌏 Oceania
  { region: "Oceania", name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { region: "Oceania", name: "Auckland", lat: -36.8485, lon: 174.7633 },
  { region: "Oceania", name: "Melbourne", lat: -37.8136, lon: 144.9631 },
  { region: "Oceania", name: "Brisbane", lat: -27.4698, lon: 153.0251 },
  { region: "Oceania", name: "Perth", lat: -31.9505, lon: 115.8605 },
];


export async function GET() {
  try {
    // 🧠 Use cached data if within 2 hours
    const now = Date.now();
    if (cachedData && now - lastFetched < 2 * 60 * 60 * 1000) {
      console.log("✅ Serving weather from memory cache");
      return NextResponse.json(
        { success: true, data: cachedData, cached: true },
        { headers: { "Cache-Control": "public, max-age=7200, s-maxage=7200" } }
      );
    }

    console.log("🌍 Fetching fresh weather data...");
    const results = await Promise.all(
      fallbackCities.map(async (city) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`;
          const res = await fetch(url, { next: { revalidate: 7200 } });
          const data = await res.json();

          const current = data?.current_weather;
          return {
            region: city.region,
            name: city.name,
            temperature: current?.temperature ?? null,
            weathercode: current?.weathercode ?? 0,
          };
        } catch {
          return { region: city.region, name: city.name, temperature: null, weathercode: 0 };
        }
      })
    );

    // 💾 Save to memory
    cachedData = results;
    lastFetched = now;

    return NextResponse.json(
      { success: true, data: results, cached: false },
      { headers: { "Cache-Control": "public, max-age=7200, s-maxage=7200, stale-while-revalidate=3600" } }
    );
  } catch (error) {
    console.error("⚠️ Weather API error:", error);

    // 🧠 Return cached data even if fetch fails
    if (cachedData) {
      return NextResponse.json(
        { success: true, data: cachedData, cached: true, note: "Returned from memory cache due to error" },
        { headers: { "Cache-Control": "public, max-age=3600" } }
      );
    }

    return NextResponse.json({ success: false, error: "Failed to load weather data" });
  }
}
