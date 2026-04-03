import { prisma } from "@/lib/prisma";
import PriceTicker from "@/components/PriceTicker";
import VideoCard from "@/components/VideoCard";
import BrokerCTA from "@/components/BrokerCTA";
import EconomicCalendar from "@/components/EconomicCalendar";
import TradingSessions from "@/components/TradingSessions";
import LiveNewsFeed from "@/components/LiveNewsFeed";
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

  // Serialize for client component
  const serializedArticles = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    titleTh: a.titleTh,
    summaryTh: a.summaryTh,
    sourceName: a.sourceName,
    category: a.category,
    publishedAt: a.publishedAt.toISOString(),
    imageUrl: a.imageUrl,
  }));

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
        {/* LEFT: Main content — auto-refreshes every 2 min */}
        <LiveNewsFeed initialArticles={serializedArticles} />

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
