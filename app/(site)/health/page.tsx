// app/health/page.tsx
import { fetchNews } from "@/lib/fetchNews";
import NewsLayout from "@/components/layout/NewsLayout";

export default async function HealthNewsPage() {
  const articles = await fetchNews("medicine");
  return <NewsLayout articles={articles} />;
}
