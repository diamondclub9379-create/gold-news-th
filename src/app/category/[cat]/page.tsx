import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ cat: string }>;
}

const validCategories: Record<string, string> = {
  gold: "ทองคำ",
  silver: "เงิน",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params;
  const label = validCategories[cat];
  if (!label) return { title: "ไม่พบหมวดหมู่" };
  return {
    title: `ข่าว${label}`,
    description: `ข่าว${label}จากต่างประเทศ แปลเป็นภาษาไทยอัตโนมัติ`,
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: Props) {
  const { cat } = await params;

  if (!validCategories[cat]) notFound();

  const articles = await prisma.article.findMany({
    where: { category: cat },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  const label = validCategories[cat];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full" />
          <h2 className="text-xl font-bold text-gray-100">ข่าว{label}</h2>
        </div>
        <CategoryFilter active={cat} />
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-40">📰</div>
          <h3 className="text-xl text-gray-400">ยังไม่มีข่าว{label}</h3>
          <p className="text-gray-600 mt-2">
            ระบบจะดึงข่าวจากต่างประเทศและแปลอัตโนมัติเร็วๆ นี้
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
