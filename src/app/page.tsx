import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";
import PriceTicker from "@/components/PriceTicker";
import VideoCard from "@/components/VideoCard";
import BrokerCTA from "@/components/BrokerCTA";
import EconomicCalendar from "@/components/EconomicCalendar";
import TradingSessions from "@/components/TradingSessions";
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
      take: 5,
    }),
  ]);

  const [featured, ...rest] = articles;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Price Ticker — full width */}
      <section className="mb-4">
        <PriceTicker />
      </section>

      {/* Economic Calendar — full width */}
      <section className="mb-4">
        <EconomicCalendar />
      </section>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* LEFT: Main content */}
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
                publishedAt={featured.publishedAt.toISOString()}
                imageUrl={featured.imageUrl}
                featured
              />
            </section>
          )}

          {/* News section header */}
          <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
              ข่าวล่าสุด
            </span>
            <CategoryFilter />
          </div>

          {/* News list */}
          {articles.length === 0 ? (
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
                  publishedAt={article.publishedAt.toISOString()}
                  imageUrl={article.imageUrl}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Sidebar */}
        <aside className="space-y-4">
          {/* Trading Sessions */}
          <TradingSessions />

          {/* Videos panel */}
          {latestVideos.length > 0 && (
            <div className="border border-gray-700 rounded-sm overflow-hidden">
              <div className="bg-gray-800 px-3 py-2 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-gray-300">
                  วิดีโอ
                </span>
                <Link
                  href="/videos"
                  className="font-mono text-[10px] text-amber-400 hover:text-amber-300 transition-colors uppercase"
                >
                  ดูทั้งหมด &rarr;
                </Link>
              </div>
              <div>
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
            </div>
          )}

          {/* Broker CTA */}
          <BrokerCTA />
        </aside>
      </div>
    </div>
  );
}
