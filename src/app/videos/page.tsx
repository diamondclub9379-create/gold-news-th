import { prisma } from "@/lib/prisma";
import VideoCard from "@/components/VideoCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "วิดีโอ",
  description: "วิดีโอข่าวทองคำจากช่องคนตื่นทอง",
};

export default async function VideosPage() {
  const videos = await prisma.video.findMany({
    orderBy: { publishedAt: "desc" },
    take: 24,
  });

  const [featured, ...rest] = videos;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-red-600 rounded-full" />
        <h1 className="text-2xl font-bold text-gray-100">วิดีโอจากช่อง คนตื่นทอง</h1>
      </div>

      {/* Featured Video */}
      {featured && (
        <section className="mb-10">
          <VideoCard
            videoId={featured.videoId}
            title={featured.title}
            description={featured.description}
            thumbnailUrl={featured.thumbnailUrl}
            channelTitle={featured.channelTitle}
            publishedAt={featured.publishedAt.toISOString()}
            featured
          />
        </section>
      )}

      {videos.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-40">🎬</div>
          <h3 className="text-xl text-gray-400">ยังไม่มีวิดีโอ</h3>
          <p className="text-gray-600 mt-2">
            ระบบจะดึงวิดีโอจากช่อง YouTube อัตโนมัติเร็วๆ นี้
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((video) => (
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
      )}
    </div>
  );
}
