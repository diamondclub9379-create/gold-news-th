import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

function generateImageUrl(title: string, category: string): string {
  const baseStyle = "photorealistic, professional financial news thumbnail, dark moody background, cinematic lighting, no text no letters no words";
  const subject = category === "silver"
    ? "silver bars and silver coins, metallic silver tones"
    : "gold bars and gold coins, warm golden tones";
  const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, "").slice(0, 80);
  const prompt = `${subject}, ${cleanTitle}, ${baseStyle}`;
  const encoded = encodeURIComponent(prompt);
  const seed = hashCode(title);
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&nologo=true&seed=${seed}`;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-api-secret");
  if (secret !== process.env.API_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Replace all non-OG images with Pollinations AI-generated images
  const articles = await prisma.article.findMany({
    select: { id: true, titleEn: true, category: true, imageUrl: true },
  });

  const results = [];
  for (const article of articles) {
    // Keep real OG images from actual news sources
    if (article.imageUrl &&
        !article.imageUrl.includes("unsplash.com") &&
        !article.imageUrl.includes("googleusercontent.com") &&
        !article.imageUrl.includes("google.com/") &&
        !article.imageUrl.includes("pollinations.ai")) {
      results.push({ id: article.id, status: "kept-og" });
      continue;
    }

    const newImage = generateImageUrl(article.titleEn, article.category);
    await prisma.article.update({
      where: { id: article.id },
      data: { imageUrl: newImage },
    });
    results.push({ id: article.id, status: "ai-generated" });
  }

  return Response.json({ total: articles.length, results });
}
