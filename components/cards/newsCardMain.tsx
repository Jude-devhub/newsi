import Link from "next/link";
import NewsImage from "@/components/cards/newsImage";

export interface Article {
  source: { id: string | null; name: string };
  author?: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
}

interface NewsCardMainProps {
  article: Article;
  variant?: "feature" | "secondary" | "list";
}

export default function NewsCardMain({
  article,
  variant = "feature",
}: NewsCardMainProps) {
  const placeholderImage = "/alternativeNewsImage.png";

  // ✅ Smart href logic
  const hasValidImage =
    article.urlToImage && article.urlToImage !== placeholderImage;
  const articleHref = hasValidImage
    ? `/read/${encodeURIComponent(article.url)}`
    : article.url; // external link if no valid image

  if (variant === "feature") {
    return (
      <article className="sm:col-span-2 flex flex-col">
        <Link href={articleHref} rel="noopener noreferrer">
          <div className="relative w-full h-72 sm:h-96">
            {hasValidImage && (
              <NewsImage
                src={article.urlToImage!}
                alt={article.title}
                fill
                sizes="100vw"
              />
            )}
          </div>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-tight hover:underline">
            {article.title}
          </h2>
          {article.description && (
            <p className="mt-2 text-base text-gray-700">{article.description}</p>
          )}
          <time className="mt-2 text-xs text-gray-500 block">
            {new Date(article.publishedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            · {article.source?.name}
          </time>
        </Link>
      </article>
    );
  }

  if (variant === "list") {
    return (
      <article className="border-t pt-3">
        <Link href={articleHref} rel="noopener noreferrer">
          <h3 className="font-semibold text-base hover:underline">{article.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{article.description}</p>
          <time className="text-xs text-gray-400">
            {new Date(article.publishedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </Link>
      </article>
    );
  }

  // Default / secondary variant
  return (
    <article>
      <Link href={articleHref} rel="noopener noreferrer" className="flex gap-3">
        <div className="relative w-32 h-20 flex-shrink-0">
          {hasValidImage && (
            <NewsImage src={article.urlToImage!} alt={article.title} fill sizes="128px" />
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg leading-snug hover:underline">{article.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.description}</p>
        </div>
      </Link>
    </article>
  );
}
