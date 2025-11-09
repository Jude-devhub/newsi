"use client";

import { useEffect, useState } from "react";
import NewsLayout from "@/components/layout/NewsLayout";

interface DashboardClientProps {
  session: any;
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  // ✅ Fetch news
  useEffect(() => {
    const getNews = async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles(data.articles || []);
      if (data.articles) {
        setLoading(false);
      }
    };
    getNews();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;


  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {session?.user?.name.split(" ")[0].charAt(0).toUpperCase() + session?.user?.name.split(" ")[0].slice(1)} 👋
      </h1>
      <p className="mb-6 text-gray-700">
        Here are the latest news articles for you,{" "}        
      </p>

      {/* 📰 News Feed Section */}
      <NewsLayout articles={articles} />
    </div>
  );
}
