"use client";

console.log("🟩 DASHBOARD PAGE LOADED");


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NewsLayout from "@/components/layout/NewsLayout";
import { fetchNews } from "@/lib/fetchNews";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);

  // ✅ Fetch user info from API using JWT cookie 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!data.success) {
          router.push("/login?redirect=/dashboard");
        } else {
          setUser(data.user);
        }
      } catch (error) {
        console.error("User fetch error:", error);
        router.push("/login?redirect=/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  //✅ Update document title after user is loaded
  useEffect(() => {
    if (user?.name) {
      document.title = `Dashboard - ${user.name}`;
    }
  }, [user]);

  // ✅ Fetch news articles
  useEffect(() => {
    const getNews = async (query:string) => {
      const data = await fetchNews(query);
      console.log("Fetched articles:", data);
      setLoading(false);
      setArticles(data);
    };
    getNews("lagos");
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  //if (!user) return null; // Prevent flashing before redirect

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl text-center space-y-3">
        <h1 className="text-2xl font-bold">Welcome, {user?.name} 🎉</h1>
        <p className="text-gray-600 mb-6">{user?.email}</p>

        {/* 📰 News Feed Section */}
        <NewsLayout articles={articles} />
      </div>
    </div>
  );
}
