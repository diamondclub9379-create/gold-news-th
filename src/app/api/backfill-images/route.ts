import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-api-secret");
  if (secret !== process.env.API_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = await prisma.article.findMany({
    where: { imageUrl: null },
    select: { id: true, sourceUrl: true, titleEn: true },
  });

  const results = [];
  for (const article of articles) {
    try {
      const res = await fetch(article.sourceUrl, {
        headers: { "User-Agent": "GoldNewsTH/1.0" },
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        results.push({ id: article.id, status: "skip", reason: `HTTP ${res.status}` });
        continue;
      }
      const html = await res.text();
      const ogMatch =
        html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
        html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);

      if (ogMatch?.[1]) {
        await prisma.article.update({
          where: { id: article.id },
          data: { imageUrl: ogMatch[1] },
        });
        results.push({ id: article.id, status: "ok", image: ogMatch[1].slice(0, 80) });
      } else {
        results.push({ id: article.id, status: "no-image" });
      }
    } catch {
      results.push({ id: article.id, status: "error" });
    }
  }

  return Response.json({ total: articles.length, results });
}
