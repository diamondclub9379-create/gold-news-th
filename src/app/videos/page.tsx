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
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="border-b border-gray-700 pb-2 mb-4">
        <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
          วิดีโอจากช่อง คนตื่นทอง
        </span>
      </div>

      {/* Featured Video */}
      {featured && (
        <section className="mb-4">
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
        <div className="text-center py-16">
          <h3 className="font-mono text-sm text-gray-500">ยังไม่มีวิดีโอ</h3>
          <p className="font-mono text-[11px] text-gray-700 mt-1">
            ระบบจะดึงวิดีโอจากช่อง YouTube อัตโนมัติเร็วๆ นี้
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map((video) => (
            <div key={video.id} className="border border-gray-800 rounded-sm overflow-hidden">
              <VideoCard
                videoId={video.videoId}
                title={video.title}
                description={video.description}
                thumbnailUrl={video.thumbnailUrl}
                channelTitle={video.channelTitle}
                publishedAt={video.publishedAt.toISOString()}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
