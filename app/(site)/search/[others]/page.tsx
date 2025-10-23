// app/[others]/page.tsx
  import { fetchNews } from "@/lib/fetchNews";
  import NewsLayout from "@/components/layout/NewsLayout";
  
  export default async function OthersPage({params}: {params: {others: string}}) {
    const search = params.others;
    const articles = await fetchNews(search);
    return <NewsLayout articles={articles} />;
  }

