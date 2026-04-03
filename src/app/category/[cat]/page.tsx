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
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-1">
        <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
          ข่าว{label}
        </span>
        <CategoryFilter active={cat} />
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="font-mono text-sm text-gray-500">ยังไม่มีข่าว{label}</h3>
          <p className="font-mono text-[11px] text-gray-700 mt-1">
            ระบบจะดึงข่าวจากต่างประเทศและแปลอัตโนมัติเร็วๆ นี้
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-800/60">
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
