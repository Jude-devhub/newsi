"use server";

import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import {
  ReadingProgressBar,
  SmoothScroll,
  ArticleTOC,
} from "./ReaderLayout";
import BackButton from "@/components/ui/backButton";

function generateId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface ReaderLayoutProps {
  url: string;
  title?: string;
}

export default async function ReaderLayout({ url }: ReaderLayoutProps) {
  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (!article) throw new Error("Unable to parse article content.");

    const articleDoc = new JSDOM(article.content || "").window.document;
    const headings: { id: string; text: string; level: number }[] = [];

    // Generate heading IDs & TOC
    articleDoc.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((heading) => {
      if (!heading.id) heading.id = generateId(heading.textContent || "heading");
      headings.push({
        id: heading.id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.replace("H", ""), 10),
      });
    });

    // Make links safe
    articleDoc.querySelectorAll("a").forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    const safeContent = articleDoc.body.innerHTML;

    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500 ease-in-out">
        <ReadingProgressBar />
        <SmoothScroll />
        <div className="max-w-6xl mx-auto p-6 md:p-10 flex flex-col md:flex-row gap-8">
          {/* TOC */}
          <ArticleTOC headings={headings} />

          {/* Article */}
          <div className="flex-1">
            <header className="mb-8">
              <BackButton label="← Back" className="mb-4" />
              <h1 className="text-3xl md:text-4xl font-extrabold leading-snug">
                {article.title}
              </h1>
              {article.byline && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  By {article.byline}
                </p>
              )}
            </header>

            <article className="prose prose-gray dark:prose-invert flex-1 shadow-sm p-6 rounded-xl bg-white dark:bg-gray-900 transition-colors duration-500 ease-in-out">
              <div dangerouslySetInnerHTML={{ __html: safeContent }} className="prose-img-wrapper" />
            </article>

            <footer className="mt-10 pt-6 text-center">
              <BackButton label="← Go back to last page" />
            </footer>
          </div>
        </div>
      </main>
    );
  } catch (error: any) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500 ease-in-out px-6">
        <div className="text-center max-w-md">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-xl font-semibold mb-2">Error loading article</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error.message}</p>
          <BackButton label="← Go back" />
        </div>
      </main>
    );
  }
}
