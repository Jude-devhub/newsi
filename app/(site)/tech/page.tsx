
import { fetchNews } from "@/lib/fetchNews";
import NewsLayout from "@/components/layout/NewsLayout";

export default async function TechNewsPage() {
  const articles = await fetchNews("Technology");
  return <NewsLayout articles={articles} />;
}
