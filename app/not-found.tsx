console.log("🟥 NOT FOUND PAGE RENDERED");

import NewsLayout from "@/components/layout/NewsLayout";
import { fetchNews } from "@/lib/fetchNews";
import AlertBox from "@/components/ui/alert";

export default async function NotFound() {
 const articles = await fetchNews("politics");
  return (
    <>
      <AlertBox message="Page was not found. Check the URL or check this articles." />
      <NewsLayout articles={articles} />
    </>
  );
}