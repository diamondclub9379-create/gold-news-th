import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

const RSS_FEEDS = [
  {
    url: "https://news.google.com/rss/search?q=gold+price+OR+silver+price+precious+metals&hl=en-US&gl=US&ceid=US:en",
    defaultSource: "Google News",
  },
  {
    url: "https://www.forexfactory.com/rss",
    defaultSource: "Forex Factory",
  },
];

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return true;
  }
  return request.headers.get("x-api-secret") === process.env.API_SECRET;
}

export async function GET(request: NextRequest) {
  return handleFetchNews(request);
}

export async function POST(request: NextRequest) {
  return handleFetchNews(request);
}

async function handleFetchNews(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!CLAUDE_API_KEY) {
    return Response.json({ error: "CLAUDE_API_KEY not configured" }, { status: 500 });
  }

  try {
    // 1. Fetch all RSS feeds
    const allItems = [];
    for (const feed of RSS_FEEDS) {
      try {
        const rssRes = await fetch(feed.url, {
          headers: { "User-Agent": "GoldNewsTH/1.0" },
        });
        if (rssRes.ok) {
          const rssText = await rssRes.text();
          const items = parseRSS(rssText, feed.defaultSource);
          allItems.push(...items);
        }
      } catch {
        // Skip failed feeds silently
      }
    }

    // 2. Get existing source URLs to deduplicate
    const existing = await prisma.article.findMany({
      select: { sourceUrl: true },
    });
    const existingUrls = new Set(existing.map((a) => a.sourceUrl));

    // 3. Filter new items
    const newItems = allItems
      .filter((item) => item.link && !existingUrls.has(item.link))
      .slice(0, 5);

    if (newItems.length === 0) {
      return Response.json({ message: "No new articles", count: 0 });
    }

    // 4. Fetch full article, translate, and save
    const results = [];
    for (const item of newItems) {
      try {
        // Fetch full article content from source
        const scraped = await scrapeArticle(item.link);
        const articleText = scraped.text || item.summary;
        const imageUrl = scraped.ogImage || pickStockImage(item.category);
        const finalUrl = scraped.finalUrl || item.link;

        // Translate full article with Claude
        const translated = await translateWithClaude(item.title, articleText);

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
            sourceUrl: finalUrl,
            sourceName: item.sourceName,
            category: item.category,
            imageUrl,
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

// ---- Scrape full article from source URL ----

interface ScrapedArticle {
  text: string;
  ogImage: string | null;
  finalUrl: string;
}

async function scrapeArticle(url: string): Promise<ScrapedArticle> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return { text: "", ogImage: null, finalUrl: url };

    const finalUrl = res.url; // After redirects
    const html = await res.text();

    // Extract OG image
    const ogMatch =
      html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
      html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
    let ogImage = ogMatch?.[1] || null;
    if (ogImage?.includes("lh3.googleusercontent.com") || ogImage?.includes("google.com/")) {
      ogImage = null;
    }

    // Extract article text
    const text = extractArticleText(html);

    return { text, ogImage, finalUrl };
  } catch {
    return { text: "", ogImage: null, finalUrl: url };
  }
}

function extractArticleText(html: string): string {
  // Remove script, style, nav, header, footer, aside tags
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  // Try to find <article> tag first
  const articleMatch = cleaned.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    cleaned = articleMatch[1];
  } else {
    // Try common content containers
    const contentMatch =
      cleaned.match(/<div[^>]*class=["'][^"']*(?:article-body|article-content|post-content|entry-content|story-body|caas-body)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
      cleaned.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);
    if (contentMatch) {
      cleaned = contentMatch[1];
    }
  }

  // Strip remaining HTML tags and decode entities
  const text = cleaned
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  // Return first 3000 chars to avoid token limits
  return text.slice(0, 3000);
}

// ---- RSS Parsing ----

function parseRSS(xml: string, defaultSource: string) {
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

    const parts = title.split(" - ");
    const sourceName = parts.length > 1 ? parts[parts.length - 1].trim() : source || defaultSource;
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

// ---- Stock Images ----

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

function pickStockImage(category: string): string {
  const pool = category === "silver" ? SILVER_IMAGES : GOLD_IMAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---- Translation ----

async function translateWithClaude(
  titleEn: string,
  articleText: string
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
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `You are a Thai financial news translator. Translate this gold/silver news article to Thai.

Title: ${titleEn}

Full article content:
${articleText}

Instructions:
- titleTh: Translate the title to Thai, make it engaging for Thai readers
- summaryTh: Write a 1-2 sentence summary in Thai
- bodyTh: Translate the full article to Thai, 3-5 paragraphs separated by \\n\\n. Keep financial terms accurate. If the source text is short, expand with relevant context about the gold/silver market.

Reply ONLY with valid JSON, no markdown:
{"titleTh": "...", "summaryTh": "...", "bodyTh": "..."}`,
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
