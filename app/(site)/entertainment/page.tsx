// app/finance/page.tsx
import { fetchNews } from "@/lib/fetchNews";
import NewsLayout from "@/components/layout/NewsLayout";

export default async function EntertainmentNewsPage() {
  const articles = await fetchNews("entertainment");
  return <NewsLayout articles={articles} />;
}


