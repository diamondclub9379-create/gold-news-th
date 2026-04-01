import Link from "next/link";

interface ArticleCardProps {
  slug: string;
  titleTh: string;
  summaryTh: string;
  sourceName: string;
  category: string;
  publishedAt: string;
  imageUrl?: string | null;
}

export default function ArticleCard({
  slug,
  titleTh,
  summaryTh,
  sourceName,
  category,
  publishedAt,
  imageUrl,
}: ArticleCardProps) {
  const categoryLabel = category === "gold" ? "ทองคำ" : "เงิน";
  const categoryColor =
    category === "gold"
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-gray-400/20 text-gray-300";

  const date = new Date(publishedAt).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/news/${slug}`} className="block group">
      <article className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-yellow-700/50 transition-all duration-200">
        {imageUrl && (
          <div className="aspect-video bg-gray-800 overflow-hidden">
            <img
              src={imageUrl}
              alt={titleTh}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor}`}
            >
              {categoryLabel}
            </span>
            <span className="text-xs text-gray-500">{sourceName}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-100 group-hover:text-yellow-400 transition-colors line-clamp-2">
            {titleTh}
          </h2>
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">
            {summaryTh}
          </p>
          <time className="text-xs text-gray-600 mt-3 block">{date}</time>
        </div>
      </article>
    </Link>
  );
}
