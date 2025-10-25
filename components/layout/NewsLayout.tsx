"use client";

import React, { useEffect, useState } from "react";
import NewsCardMain, { Article } from "@/components/cards/newsCardMain";
import NewsCarousel from "@/components/cards/newsCarousel";

interface NewsLayoutProps {
  articles?: Article[];
}

export default function NewsLayout({ articles = [] }: NewsLayoutProps) {
   const [navbarHeight, setNavbarHeight] = useState(0);

  // ✅ Automatically detect and set navbar height dynamically
  // useEffect(() => {
  //   const navbar = document.querySelector("nav");
  //   if (navbar) setNavbarHeight(navbar.offsetHeight);
  // }, []);

  if (!articles.length)
    return <p className="text-center mt-10 text-gray-600">No news available</p>;

  // 🧠 Article layout slices
  const feature = articles[0];
  const secondary = articles.slice(1, 3);
  const sidebar = articles.slice(4, 8);
  const carouselOne = articles.slice(9, 15);
  const listGrid = articles.slice(16, 30);
  const carouselTwo = articles.slice(31);

  return (
    <main
      className="relative min-h-screen bg-gray-50 pb-16 transition-all duration-300"
     
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 space-y-12">
        {/* 📰 Top News Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Left: Feature + Secondary */}
          <div className="md:col-span-2 space-y-8">
            <NewsCardMain article={feature} variant="feature" />
            <div className="grid sm:grid-cols-2 gap-6">
              {secondary.map((a) => (
                <NewsCardMain key={a.url} article={a} variant="list" />
              ))}
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="space-y-4">
            {sidebar.map((a) => (
              <NewsCardMain key={a.url} article={a} variant="secondary" />
            ))}
          </aside>
        </section>

        <Divider />

        {/* 🎠 Carousel 1 */}
        {carouselOne.length > 0 && (
          <>
            <SectionWithHeader title="More News">
              <NewsCarousel index={1} articles={carouselOne} />
            </SectionWithHeader>
            <Divider />
          </>
        )}

        {/* 🗞️ News Grid */}
        {listGrid.length > 0 && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {listGrid.map((a) => (
                <NewsCardMain key={a.url} article={a} variant="feature" />
              ))}
            </section>
            <Divider />
          </>
        )}

        {/* 🔥 Carousel 2 */}
        {carouselTwo.length > 0 && (
          <SectionWithHeader title="Trending News">
            <NewsCarousel index={2} articles={carouselTwo} />
          </SectionWithHeader>
        )}
      </div>
    </main>
  );
}

/* -----------------------
   🧱 Reusable Components
----------------------- */

function SectionWithHeader({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Divider() {
  return <hr className="border-t border-gray-200" />;
}
