"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author?: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
}

export default function NewsCarousel({ index, articles }: { index: number; articles: Article[] }) {

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 3, spacing: 20 },
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 1, spacing: 10 },
      },
      "(min-width: 769px) and (max-width: 1024px)": {
        slides: { perView: 2, spacing: 15 },
      },
    },
  });



  return (
    <div className="w-full px-4 py-6">
      <div ref={sliderRef} className="keen-slider">
        {articles.map((article, i) => (
          <div
            key={i}
            className="keen-slider__slide bg-white shadow rounded-xl overflow-hidden"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt="Image loading..."
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase text-gray-500 border-b pb-1">
                {article.source?.name}
              </h3>
              <a
                href={`/read/${encodeURIComponent(article.url)}` ? `/read/${encodeURIComponent(article.url)}` : article.url}
                
                rel="noopener noreferrer"
                className="block text-lg font-semibold hover:text-blue-600 transition"
              >
                {article.title}
              </a>
              <p className="text-sm text-gray-600">{article.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
