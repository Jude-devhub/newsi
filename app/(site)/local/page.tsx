// app/local/page.tsx
import { fetchNews } from "@/lib/fetchNews";
import NewsLayout from "@/components/layout/NewsLayout";

export default async function LocalNewsPage() {
  const articles = await fetchNews("local");
  return <NewsLayout articles={articles} />;
}
