// app/science/page.tsx
import { fetchNews } from "@/lib/fetchNews";
import NewsLayout from "@/components/layout/NewsLayout";

export default async function ScienceNewsPage() {
  const articles = await fetchNews("science");
  return <NewsLayout articles={articles} />;
}
