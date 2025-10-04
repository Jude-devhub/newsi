// lib/fetchGNews.ts
export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

export async function fetchGNews(query: string, lang = "en", max = 100): Promise<GNewsArticle[]> {
  try {
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}&max=${max}&apikey=${process.env.GNEWS_API_KEY}`,
      { next: { revalidate: 1200 } } // cache for 20 mins
    );

    if (!res.ok) {
      console.error("GNews API error:", res.status, res.statusText);
      return [];
    }

    const data = (await res.json()) as GNewsResponse;
    return data.articles || [];
  } catch (err) {
    console.error("Fetch GNews failed:", err);
    return [];
  }
}
