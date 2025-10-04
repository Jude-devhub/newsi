// app/finance/page.tsx
import { fetchNews } from "@/lib/fetchNews";
import NewsLayout from "@/components/layout/NewsLayout";

export default async function FinanceNewsPage() {
  const articles = await fetchNews("finance");
  return <NewsLayout articles={articles} />;
}
