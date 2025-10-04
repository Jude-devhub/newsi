import { fetchNews } from "@/lib/fetchNews";
import NewsLayout from "@/components/layout/NewsLayout";

export default async function DashboardPage() {
  const [entertainment, finance, sports, tech, general] = await Promise.all([
    fetchNews("entertainment movies tv"),
    fetchNews("foreign exchange market"),
    fetchNews("english premier league"),
    fetchNews("electronics chips technology"),
    fetchNews("BBC nigeria"), // fallback for local/world
  ]);

  // merge
  const articles = [
    ...entertainment.slice(0, 5),
    ...finance.slice(0, 5),
    ...sports.slice(0, 5),
    ...tech.slice(0, 5),
    ...general.slice(0, 5),
  ];

  if (articles.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        ⚠️ No news available at the moment. Please try again later.
      </div>
    );
  }

  return (
    <NewsLayout articles={articles} />
  );
}
