import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return { title: "ไม่พบข่าว" };

  return {
    title: article.titleTh,
    description: article.summaryTh,
    openGraph: {
      title: article.titleTh,
      description: article.summaryTh,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      ...(article.imageUrl && { images: [article.imageUrl] }),
    },
  };
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });

  if (!article) notFound();

  const categoryLabel = article.category === "gold" ? "ทองคำ" : "เงิน";
  const categoryColor =
    article.category === "gold"
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-gray-400/20 text-gray-300";

  const date = article.publishedAt.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-yellow-600 hover:text-yellow-400 transition"
        >
          &larr; กลับหน้าแรก
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor}`}
        >
          {categoryLabel}
        </span>
        <span className="text-sm text-gray-500">{article.sourceName}</span>
        <time className="text-sm text-gray-600">{date}</time>
      </div>

      <h1 className="text-3xl font-bold text-yellow-400 leading-tight mb-4">
        {article.titleTh}
      </h1>

      <p className="text-lg text-gray-300 mb-6 leading-relaxed">
        {article.summaryTh}
      </p>

      {article.imageUrl && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.titleTh}
            className="w-full"
          />
        </div>
      )}

      <div className="prose prose-invert prose-yellow max-w-none">
        {article.bodyTh.split("\n").map((paragraph, i) => (
          <p key={i} className="text-gray-300 leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800">
        <p className="text-sm text-gray-500">
          หัวข้อต้นฉบับ:{" "}
          <span className="text-gray-400 italic">{article.titleEn}</span>
        </p>
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-yellow-600 hover:text-yellow-400 transition mt-1 inline-block"
        >
          อ่านข่าวต้นฉบับ &rarr;
        </a>
      </div>
    </article>
  );
}
