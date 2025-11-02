console.log("🟥 NOT FOUND PAGE RENDERED");

import NewsLayout from "@/components/layout/NewsLayout";
import { fetchNews } from "@/lib/fetchNews";
import AlertBox from "@/components/ui/alert";
import Link from "next/link";

export default async function NotFound() {
 //const articles = await fetchNews("politics");
  return (
    <>
      <AlertBox message="Sorry, something went wrong!" />

      <h1>
      <Link href={'/'}>Return to News</Link>
      </h1>
      
    </>
  );
}