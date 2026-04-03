import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";
import PriceTicker from "@/components/PriceTicker";
import VideoCard from "@/components/VideoCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [articles, latestVideos] = await Promise.all([
    prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
      take: 20,
    }),
    prisma.video.findMany({
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  const [featured, ...rest] = articles;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Price Ticker */}
      <section className="mb-8">
        <PriceTicker />
      </section>

      {/* Hero / Featured Article */}
      {featured && (
        <section className="mb-10">
          <ArticleCard
            slug={featured.slug}
            titleTh={featured.titleTh}
            summaryTh={featured.summaryTh}
            sourceName={featured.sourceName}
            category={featured.category}
            publishedAt={featured.publishedAt.toISOString()}
            imageUrl={featured.imageUrl}
            featured
          />
        </section>
      )}

      {/* Latest Videos */}
      {latestVideos.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-red-600 rounded-full" />
              <h2 className="text-xl font-bold text-gray-100">วิดีโอล่าสุด</h2>
            </div>
            <Link
              href="/videos"
              className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              ดูทั้งหมด
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {latestVideos.map((video) => (
              <VideoCard
                key={video.id}
                videoId={video.videoId}
                title={video.title}
                description={video.description}
                thumbnailUrl={video.thumbnailUrl}
                channelTitle={video.channelTitle}
                publishedAt={video.publishedAt.toISOString()}
              />
            ))}
          </div>
        </section>
      )}

      {/* Latest News */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full" />
          <h2 className="text-xl font-bold text-gray-100">ข่าวล่าสุด</h2>
        </div>
        <CategoryFilter />
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-40">📰</div>
          <h3 className="text-xl text-gray-400">ยังไม่มีข่าว</h3>
          <p className="text-gray-600 mt-2">
            ระบบจะดึงข่าวจากต่างประเทศและแปลอัตโนมัติเร็วๆ นี้
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((article) => (
            <ArticleCard
              key={article.id}
              slug={article.slug}
              titleTh={article.titleTh}
              summaryTh={article.summaryTh}
              sourceName={article.sourceName}
              category={article.category}
              publishedAt={article.publishedAt.toISOString()}
              imageUrl={article.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
