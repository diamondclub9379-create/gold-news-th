"use client";

import Link from "next/link";
import { useState } from "react";

function ArticleImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

interface ArticleCardProps {
  slug: string;
  titleTh: string;
  summaryTh: string;
  sourceName: string;
  category: string;
  publishedAt: string;
  imageUrl?: string | null;
  featured?: boolean;
}

export default function ArticleCard({
  slug,
  titleTh,
  summaryTh,
  sourceName,
  category,
  publishedAt,
  imageUrl,
  featured = false,
}: ArticleCardProps) {
  const categoryLabel = category === "gold" ? "GOLD" : "SILVER";
  const categoryColor =
    category === "gold"
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : "bg-gray-500/10 text-gray-400 border-gray-500/20";

  const time = new Date(publishedAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const date = new Date(publishedAt).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
  });

  if (featured) {
    return (
      <Link href={`/news/${slug}`} className="block group">
        <article className="border border-gray-700 rounded-sm overflow-hidden bg-gray-950 hover:border-amber-700/50 transition-colors">
          {imageUrl && (
            <div className="aspect-[21/9] bg-gray-900 overflow-hidden">
              <ArticleImage
                src={imageUrl}
                alt={titleTh}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-sm border uppercase ${categoryColor}`}>
                {categoryLabel}
              </span>
              <span className="font-mono text-[10px] text-gray-600">{sourceName}</span>
              <span className="font-mono text-[10px] text-gray-600 ml-auto">{date} {time}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-100 group-hover:text-amber-400 transition-colors leading-snug">
              {titleTh}
            </h2>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
              {summaryTh}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  // Non-featured: List row style
  return (
    <Link href={`/news/${slug}`} className="block group">
      <article className="flex items-start gap-3 py-3 hover:bg-gray-900/50 transition-colors px-1">
        <span className="font-mono text-[11px] text-gray-600 w-12 shrink-0 pt-0.5">
          {time}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-mono text-[10px] px-1.5 py-0 rounded-sm border uppercase leading-relaxed ${categoryColor}`}>
              {categoryLabel}
            </span>
            <span className="font-mono text-[10px] text-gray-600">{sourceName}</span>
          </div>
          <h2 className="text-sm font-medium text-gray-200 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {titleTh}
          </h2>
        </div>
      </article>
    </Link>
  );
}
