import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";

export const dynamic = "force-dynamic";

export default async function Home() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">ข่าวล่าสุด</h2>
        <CategoryFilter />
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl text-gray-400">ยังไม่มีข่าว</h3>
          <p className="text-gray-600 mt-2">
            ระบบจะดึงข่าวจากต่างประเทศและแปลอัตโนมัติเร็วๆ นี้
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
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
