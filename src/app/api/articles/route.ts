import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where = category ? { category } : {};

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return Response.json({
    articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const apiSecret = request.headers.get("x-api-secret");
  if (apiSecret !== process.env.API_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.titleEn || !body.titleTh) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const slug =
    body.slug ||
    body.titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) +
      "-" +
      Date.now().toString(36);

  try {
    const article = await prisma.article.create({
      data: {
        slug,
        titleEn: body.titleEn,
        titleTh: body.titleTh,
        summaryEn: body.summaryEn,
        summaryTh: body.summaryTh,
        bodyTh: body.bodyTh,
        sourceUrl: body.sourceUrl,
        sourceName: body.sourceName,
        category: body.category,
        imageUrl: body.imageUrl || null,
        publishedAt: new Date(body.publishedAt),
      },
    });
    return Response.json({ success: true, article }, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    if (message.includes("Unique constraint")) {
      return Response.json(
        { error: "Article already exists" },
        { status: 409 }
      );
    }
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const apiSecret = request.headers.get("x-api-secret");
  if (apiSecret !== process.env.API_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.article.delete({ where: { id: parseInt(id) } });
  return Response.json({ success: true });
}
