console.log("🟥 NOT FOUND PAGE RENDERED");

import NewsLayout from "@/components/layout/NewsLayout";
import { fetchNews } from "@/lib/fetchNews";
import AlertBox from "@/components/ui/alert";
import Link from "next/link";

export default async function NotFound() {
 //const articles = await fetchNews("politics");
  return (
    <>
      <AlertBox message="Page was not found. Check the URL or check this articles." />

      <h1>404 - Not Found</h1>
      {/* <NewsLayout articles={articles} /> */}
      <p>The article you are looking for does not exist.</p>
      <Link href={'/'}>Return to News</Link>
      
    </>
  );
}