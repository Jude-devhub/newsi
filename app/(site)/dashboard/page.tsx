"use client";

console.log("🟩 DASHBOARD PAGE LOADED");


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NewsLayout from "@/components/layout/NewsLayout";

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
    const getNews = async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles(data.articles);
     
      
    };
    getNews();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  //if (!user) return null; // Prevent flashing before redirect

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name.split(" ")[0].charAt(0).toUpperCase()}{user?.name.split(" ")[0].slice(1)}{' '}{user?.name.split(" ")[1].charAt(0).toUpperCase()}{user?.name.split(" ")[1].slice(1)}!</h1>
      <p className="mb-6 text-gray-700">Here are the latest news articles for you,{" "}
        <span className="text-blue-700 font-bold">{user?.name.split(" ")[0].charAt(0).toUpperCase()}{user?.name.split(" ")[0].slice(1)}</span>:
      </p>
      {/* 📰 News Feed Section */}
      <NewsLayout articles={articles} />
    </div>
  );
}
