// app/world/page.tsx
import { fetchNews } from "@/lib/fetchNews";
import NewsLayout from "@/components/layout/NewsLayout";

export default async function WorldNewsPage() {
  const articles = await fetchNews("war");
  return <NewsLayout articles={articles} />;
}
