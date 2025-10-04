import NewsLayout from "@/components/layout/NewsLayout";
import { fetchNews } from "@/lib/fetchNews";
import AlertBox from "@/components/layout/alert";

export default async function NotFound() {
  const articles = await fetchNews("bbc news");
  return (
    <>
      <AlertBox message="Page was not found. Check the URL or go back to the homepage." />
      <NewsLayout articles={articles} />
    </>
  );
}