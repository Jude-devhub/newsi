"use client";

import { useEffect, useState } from "react";
import NewsLayout from "@/components/layout/NewsLayout";

interface DashboardClientProps {
  session: any;
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user info
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await fetch("/api/auth/me");
  //       const data = await res.json();

  //       if (!data.success) {
  //         window.location.href = "/login?redirect=/dashboard";
  //       } else {
  //         setUser(data.user);
  //       }
  //     } catch (error) {
  //       console.error("User fetch error:", error);
  //       window.location.href = "/login?redirect=/dashboard";
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUser();
  // }, []);

  // ✅ Fetch news
  useEffect(() => {
    const getNews = async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles(data.articles || []);
    };
    getNews();
  }, []);

  //if (loading) return <p className="text-center mt-10">Loading...</p>;

  const name = user?.name
    ?.split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {name || session?.user?.name} 👋
      </h1>
      <p className="mb-6 text-gray-700">
        Here are the latest news articles for you,{" "}
        <span className="text-blue-700 font-bold">
          {user?.name?.split(" ")[0] || session?.user?.name?.split(" ")[0]}
        </span>
        :
      </p>

      {/* 📰 News Feed Section */}
      <NewsLayout articles={articles} />
    </div>
  );
}
