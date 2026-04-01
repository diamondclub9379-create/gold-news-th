import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const RSS_URL =
  "https://news.google.com/rss/search?q=gold+price+OR+silver+price+precious+metals&hl=en-US&gl=US&ceid=US:en";

export async function POST(request: NextRequest) {
  const apiSecret = request.headers.get("x-api-secret");
  if (apiSecret !== process.env.API_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!CLAUDE_API_KEY) {
    return Response.json({ error: "CLAUDE_API_KEY not configured" }, { status: 500 });
  }

  try {
    // 1. Fetch RSS
    const rssRes = await fetch(RSS_URL);
    const rssText = await rssRes.text();
    const items = parseRSS(rssText);

    // 2. Get existing source URLs to deduplicate
    const existing = await prisma.article.findMany({
      select: { sourceUrl: true },
    });
    const existingUrls = new Set(existing.map((a) => a.sourceUrl));

    // 3. Filter new items
    const newItems = items
      .filter((item) => item.link && !existingUrls.has(item.link))
      .slice(0, 5);

    if (newItems.length === 0) {
      return Response.json({ message: "No new articles", count: 0 });
    }

    // 4. Translate and save each
    const results = [];
    for (const item of newItems) {
      try {
        const translated = await translateWithClaude(item.title, item.summary);

        const slug =
          item.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 80) +
          "-" +
          Date.now().toString(36);

        const article = await prisma.article.create({
          data: {
            slug,
            titleEn: item.title,
            titleTh: translated.titleTh,
            summaryEn: item.summary,
            summaryTh: translated.summaryTh,
            bodyTh: translated.bodyTh,
            sourceUrl: item.link,
            sourceName: item.sourceName,
            category: item.category,
            publishedAt: new Date(item.publishedAt),
          },
        });

        results.push({ status: "ok", title: item.title.slice(0, 60), id: article.id });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown";
        results.push({ status: "error", title: item.title.slice(0, 60), error: msg });
      }
    }

    return Response.json({ message: "Done", count: results.length, results });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown";
    return Response.json({ error: msg }, { status: 500 });
  }
}

function parseRSS(xml: string) {
  const items: Array<{
    title: string;
    link: string;
    summary: string;
    sourceName: string;
    category: string;
    publishedAt: string;
  }> = [];

  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const itemXml of itemMatches) {
    const title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link");
    const description = extractTag(itemXml, "description");
    const pubDate = extractTag(itemXml, "pubDate");
    const source = extractTag(itemXml, "source");

    if (!title || !link) continue;

    // Google News titles often have " - SourceName" at the end
    const parts = title.split(" - ");
    const sourceName = parts.length > 1 ? parts[parts.length - 1].trim() : source || "Google News";
    const cleanTitle = parts.length > 1 ? parts.slice(0, -1).join(" - ").trim() : title;

    const text = (cleanTitle + " " + (description || "")).toLowerCase();
    const category = text.includes("silver") && !text.includes("gold") ? "silver" : "gold";

    items.push({
      title: cleanTitle,
      link,
      summary: (description || cleanTitle).slice(0, 500),
      sourceName,
      category,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    });
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?</${tag}>`, "s"));
  return match ? match[1].trim() : "";
}

async function translateWithClaude(
  titleEn: string,
  summaryEn: string
): Promise<{ titleTh: string; summaryTh: string; bodyTh: string }> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": CLAUDE_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Translate this gold/silver news to Thai. Reply ONLY with valid JSON, no markdown.

Title: ${titleEn}
Summary: ${summaryEn}

JSON format: {"titleTh": "...", "summaryTh": "...", "bodyTh": "... 2-3 paragraphs separated by \\n"}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Claude API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in Claude response");
  return JSON.parse(jsonMatch[0]);
}
