import { fetchNews } from "@/lib/fetchNews";
import NewsLayout from "@/components/layout/NewsLayout";

export default async function SportsPage() {
  const [englishEPL, spanishLaLiga, frenchLigue1, germanBundesliga, 
    italianSerieA, europaLeague, fifaWorldCup, nigerianLeague] = await Promise.all([
    fetchNews("epl"),
    fetchNews("laliga"),
    fetchNews("ligue 1"),
    fetchNews("bundesliga"),
    fetchNews("serie a"),
    fetchNews("europa league"),
    fetchNews("world cup"),
    fetchNews("nfl"),
  ]);

  // merge
  const articles = [
    ...englishEPL.slice(0, 3),
    ...spanishLaLiga.slice(0, 3),
    ...frenchLigue1.slice(0, 3),
    ...germanBundesliga.slice(0, 3),
    ...italianSerieA.slice(0, 3),
    ...europaLeague.slice(0, 3),
    ...fifaWorldCup.slice(0, 3),
    ...nigerianLeague.slice(0, 3),
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
