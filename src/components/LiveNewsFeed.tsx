"use client";

import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";

interface Article {
  id: number;
  slug: string;
  titleTh: string;
  summaryTh: string;
  sourceName: string;
  category: string;
  publishedAt: string;
  imageUrl: string | null;
}

interface LiveNewsFeedProps {
  initialArticles: Article[];
}

export default function LiveNewsFeed({ initialArticles }: LiveNewsFeedProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    async function refresh() {
      try {
        const res = await fetch("/api/articles?limit=20");
        if (res.ok) {
          const json = await res.json();
          if (json.articles && json.articles.length > 0) {
            setArticles(json.articles);
            setLastUpdate(
              new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })
            );
          }
        }
      } catch {
        // ignore
      }
    }

    // Refresh every 2 minutes
    const interval = setInterval(refresh, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const [featured, ...rest] = articles;

  return (
    <div>
      {/* Featured Article */}
      {featured && (
        <section className="mb-4">
          <ArticleCard
            slug={featured.slug}
            titleTh={featured.titleTh}
            summaryTh={featured.summaryTh}
            sourceName={featured.sourceName}
            category={featured.category}
            publishedAt={featured.publishedAt}
            imageUrl={featured.imageUrl}
            featured
          />
        </section>
      )}

      {/* News section header */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-1">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
            ข่าวล่าสุด
          </span>
          {lastUpdate && (
            <span className="font-mono text-[10px] text-gray-600">
              อัพเดท {lastUpdate}
            </span>
          )}
        </div>
      </div>

      {/* News list */}
      {rest.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="font-mono text-sm text-gray-500">ยังไม่มีข่าว</h3>
          <p className="font-mono text-[11px] text-gray-700 mt-1">
            ระบบจะดึงข่าวจากต่างประเทศและแปลอัตโนมัติเร็วๆ นี้
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-800/60">
          {rest.map((article) => (
            <ArticleCard
              key={article.id}
              slug={article.slug}
              titleTh={article.titleTh}
              summaryTh={article.summaryTh}
              sourceName={article.sourceName}
              category={article.category}
              publishedAt={article.publishedAt}
              imageUrl={article.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
