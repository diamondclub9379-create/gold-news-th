import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import BrokerCTA from "@/components/BrokerCTA";
import ShareButtons from "@/components/ShareButtons";

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
  const categoryIcon = article.category === "gold" ? "Au" : "Ag";
  const categoryColor =
    article.category === "gold"
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : "bg-gray-500/10 text-gray-400 border-gray-500/20";

  const date = article.publishedAt.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="max-w-3xl mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-gray-500 hover:text-amber-400 transition-colors"
        >
          &larr; กลับหน้าแรก
        </Link>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-sm border uppercase ${categoryColor}`}>
          {categoryLabel}
        </span>
        <span className="font-mono text-[11px] text-gray-500">{article.sourceName}</span>
        <time className="font-mono text-[11px] text-gray-600">{date}</time>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-50 leading-tight mb-4">
        {article.titleTh}
      </h1>

      {/* Share + Summary */}
      <div className="flex items-center justify-between mb-6">
        <ShareButtons title={article.titleTh} slug={article.slug} />
      </div>
      <p className="text-lg text-gray-400 mb-8 leading-relaxed border-l-2 border-amber-600/40 pl-4">
        {article.summaryTh}
      </p>

      {/* Image */}
      {article.imageUrl && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.titleTh}
            className="w-full"
          />
        </div>
      )}

      {/* Body */}
      <div className="space-y-4">
        {article.bodyTh.split("\n").map((paragraph, i) => (
          <p key={i} className="text-gray-300 text-[17px] leading-[1.8]">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Share bottom */}
      <div className="mt-8 pt-4 border-t border-gray-800/60 flex items-center justify-between">
        <span className="font-mono text-[11px] text-gray-600">แชร์บทความนี้</span>
        <ShareButtons title={article.titleTh} slug={article.slug} />
      </div>

      <BrokerCTA />

      {/* Source */}
      <div className="mt-10 pt-6 border-t border-gray-800/60">
        <p className="text-sm text-gray-500 mb-2">
          หัวข้อต้นฉบับ:{" "}
          <span className="text-gray-400 italic">{article.titleEn}</span>
        </p>
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-yellow-600 hover:text-yellow-400 transition group"
        >
          อ่านข่าวต้นฉบับ
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </div>
    </article>
  );
}
