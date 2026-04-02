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
  const categoryLabel = category === "gold" ? "ทองคำ" : "เงิน";
  const categoryIcon = category === "gold" ? "Au" : "Ag";
  const categoryColor =
    category === "gold"
      ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
      : "bg-gray-400/15 text-gray-300 border border-gray-500/20";

  const date = new Date(publishedAt).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (featured) {
    return (
      <Link href={`/news/${slug}`} className="block group">
        <article className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-yellow-950/30 border border-yellow-700/20 rounded-2xl overflow-hidden hover:border-yellow-600/40 transition-all duration-300 shadow-lg shadow-black/20">
          {imageUrl && (
            <div className="aspect-[21/9] bg-gray-800 overflow-hidden">
              <ArticleImage
                src={imageUrl}
                alt={titleTh}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 ${categoryColor}`}
              >
                <span className="font-mono text-[10px] opacity-60">{categoryIcon}</span>
                {categoryLabel}
              </span>
              <span className="text-xs text-gray-500">{sourceName}</span>
              <span className="text-xs text-gray-600 ml-auto">{date}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-50 group-hover:text-yellow-400 transition-colors leading-snug">
              {titleTh}
            </h2>
            <p className="text-base text-gray-400 mt-3 line-clamp-2 leading-relaxed">
              {summaryTh}
            </p>
            <div className="mt-4 text-sm text-yellow-600 group-hover:text-yellow-400 transition-colors flex items-center gap-1">
              อ่านเพิ่มเติม
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/news/${slug}`} className="block group">
      <article className="h-full bg-gray-900/80 border border-gray-800/80 rounded-xl overflow-hidden hover:border-yellow-700/40 hover:bg-gray-900 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-900/5">
        {imageUrl && (
          <div className="aspect-video bg-gray-800 overflow-hidden">
            <img
              src={imageUrl}
              alt={titleTh}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${categoryColor}`}
            >
              <span className="font-mono text-[9px] opacity-60">{categoryIcon}</span>
              {categoryLabel}
            </span>
            <span className="text-[11px] text-gray-500">{sourceName}</span>
          </div>
          <h2 className="text-[15px] font-semibold text-gray-100 group-hover:text-yellow-400 transition-colors leading-snug line-clamp-2">
            {titleTh}
          </h2>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {summaryTh}
          </p>
          <time className="text-[11px] text-gray-600 mt-3 block">{date}</time>
        </div>
      </article>
    </Link>
  );
}
