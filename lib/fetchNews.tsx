// lib/fetchNews.ts
import { Article } from "@/components/cards/newsCardMain";

export interface ApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

// In-memory cache
const cache: Record<string, { data: Article[]; timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 60 * 2; // 2 hours

export async function fetchNews(query: string, daysAgo: number = 3): Promise<Article[]> {
   console.log(">>> FETCHNEWS CALLED with:", query);
   console.log(new Error().stack?.split("\n").slice(0, 3).join("\n"));
  const now = Date.now();

  // ✅ Return cached data if fresh
  if (cache[query] && now - cache[query].timestamp < CACHE_TTL) {
    return cache[query].data;
  }

  try {
    const today = new Date();
    today.setDate(today.getDate() - daysAgo);
    const formattedDate = today.toISOString().split("T")[0];
    const lang = "en";

    console.log(`Fetching news for query: ${query}, from date:  ${formattedDate}`, query)

    const res = await fetch(      
      `https://newsapi.org/v2/everything?q=${query}&from=${formattedDate}&sortBy=publishedAt&language=${lang}&apiKey=${process.env.SECRET_API_KEY}`,
      { next: { revalidate: 7200 } } // revalidate every 2 hours
    );

    if (!res.ok) {
      console.error("News API error:", query, res.status, res.statusText);

      // ✅ fallback to cache if available
      if (cache[query]) return cache[query].data;

      return []; // if no cache, return empty
    }

    const data = (await res.json()) as ApiResponse;
    const articles = data.articles || [];

    // ✅ Save to cache
    cache[query] = { data: articles, timestamp: now };

    return articles;
  } catch (err) {
    console.error("Fetch failed:", err);
    return cache[query]?.data || []; // fallback to cached data
  }
}
