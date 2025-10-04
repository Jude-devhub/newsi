import React from "react";
import NewsCardMain, { Article } from "@/components/cards/newsCardMain";
import NewsCarousel from "@/components/cards/newsCarousel";

interface NewsLayoutProps {
  articles?: Article[];
}

export default function NewsLayout({ articles = [] }: NewsLayoutProps) {
  if (!articles.length) return <p>No news available</p>;

  // Define ranges for clarity
  const feature = articles[0];
  const secondary = articles.slice(1, 3);
  const sidebar = articles.slice(4, 8);
  const carouselOne = articles.slice(9, 15);
  const listGrid = articles.slice(16, 30);
  const carouselTwo = articles.slice(31);

  return (
    <main className="container mx-auto px-4 py-8 grid gap-8 
      grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Left column: Feature + Secondary */}
      <section className="md:col-span-2 space-y-6">
        <NewsCardMain article={feature} variant="feature" />
        <div className="grid sm:grid-cols-2 gap-6">
          {secondary.map((a) => (
            <NewsCardMain key={a.url} article={a} variant="list" />
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        {sidebar.map((a) => (
          <NewsCardMain key={a.url} article={a} variant="secondary" />
        ))}
      </aside>

      <Divider />

      {/* Carousel 1 */}
      {carouselOne.length > 0 && (
        <>
          <SectionWithHeader title="More News">
            <NewsCarousel index={1} articles={carouselOne} />
          </SectionWithHeader>
          <Divider />
        </>
      )}

      {/* Full-width List */}
      {listGrid.length > 0 && (
        <>
          <section className="col-span-1 md:col-span-2 lg:col-span-3 
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listGrid.map((a) => (
              <NewsCardMain key={a.url} article={a} variant="feature" />
            ))}
          </section>
          <Divider />
        </>
      )}

      {/* Carousel 2 */}
      {carouselTwo.length > 0 && (
        <>
          <SectionWithHeader title="More News">
            <NewsCarousel index={2} articles={carouselTwo} />
          </SectionWithHeader>
          
        </>
      )}
    </main>
  );
}

/* Reusable header wrapper */
function SectionWithHeader({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="lg:col-span-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

/* Reusable Divider */
function Divider() {
  return <hr className="lg:col-span-3 border-t border-gray-300 my-8" />;
}
