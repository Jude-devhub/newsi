// app/finance/page.tsx
import { fetchNews } from "@/lib/fetchNews";
import NewsLayout from "@/components/layout/NewsLayout";
import { getUserCountry } from "@/lib/getUserCountry";

export default async function HomePage() {
  const country = await getUserCountry();
  console.log("country returned", country);
  const articles = await fetchNews(country || "Nigeria");
  return <NewsLayout articles={articles} />;
}
