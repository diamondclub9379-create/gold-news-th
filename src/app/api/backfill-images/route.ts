import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const GOLD_IMAGES = [
  "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1543699565-003b8adda5fc?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1498408040764-ab6eb772a145?w=800&h=450&fit=crop",
];
const SILVER_IMAGES = [
  "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1574607383476-f517f260d30b?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=450&fit=crop",
];

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-api-secret");
  if (secret !== process.env.API_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fix ALL articles — replace Google News logos and null images
  const articles = await prisma.article.findMany({
    select: { id: true, sourceUrl: true, category: true, imageUrl: true },
  });

  const results = [];
  for (const article of articles) {
    const isGoogleLogo = article.imageUrl?.includes("lh3.googleusercontent.com") || article.imageUrl?.includes("google.com/");
    const isBrokenUnsplash = article.imageUrl?.includes("unsplash.com/photo-1624365168968") || article.imageUrl?.includes("unsplash.com/photo-1589787168422") || article.imageUrl?.includes("unsplash.com/photo-1638435029519");
    if (article.imageUrl && !isGoogleLogo && !isBrokenUnsplash) {
      results.push({ id: article.id, status: "kept" });
      continue;
    }

    // Try fetching real OG image from source
    let newImage: string | null = null;
    try {
      const res = await fetch(article.sourceUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; GoldNewsTH/1.0)" },
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const html = await res.text();
        const ogMatch =
          html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
          html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
        const img = ogMatch?.[1];
        if (img && !img.includes("lh3.googleusercontent.com") && !img.includes("google.com/")) {
          newImage = img;
        }
      }
    } catch {
      // Fall through
    }

    // Fallback to stock images
    if (!newImage) {
      const pool = article.category === "silver" ? SILVER_IMAGES : GOLD_IMAGES;
      newImage = pool[article.id % pool.length];
    }

    await prisma.article.update({
      where: { id: article.id },
      data: { imageUrl: newImage },
    });
    results.push({ id: article.id, status: "updated", image: newImage.slice(0, 60) });
  }

  return Response.json({ total: articles.length, results });
}
