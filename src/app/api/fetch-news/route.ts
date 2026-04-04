import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const RSS_FEEDS = [
  {
    url: "https://news.google.com/rss/search?q=gold+price+OR+silver+price+precious+metals&hl=en-US&gl=US&ceid=US:en",
    defaultSource: "Google News",
  },
  {
    url: "https://www.forexfactory.com/rss",
    defaultSource: "Forex Factory",
  },
  {
    url: "https://www.kitco.com/feed/rss/news/gold",
    defaultSource: "Kitco",
  },
  {
    url: "https://feeds.finance.yahoo.com/rss/2.0/headline?s=GC=F,SI=F&region=US&lang=en-US",
    defaultSource: "Yahoo Finance",
  },
  {
    url: "https://news.google.com/rss/search?q=gold+forecast+OR+gold+analysis+OR+XAU+OR+precious+metals+outlook&hl=en-US&gl=US&ceid=US:en",
    defaultSource: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=site:reuters.com+gold+OR+silver+commodities&hl=en-US&gl=US&ceid=US:en",
    defaultSource: "Reuters",
  },
  {
    url: "https://news.google.com/rss/search?q=site:cnbc.com+gold+price+OR+precious+metals&hl=en-US&gl=US&ceid=US:en",
    defaultSource: "CNBC",
  },
  {
    url: "https://news.google.com/rss/search?q=site:investing.com+gold+OR+silver+OR+XAU&hl=en-US&gl=US&ceid=US:en",
    defaultSource: "Investing.com",
  },
  // --- International: FXStreet, Mining.com, DailyFX, World Gold Council, BullionVault ---
  {
    url: "https://www.fxstreet.com/rss/news",
    defaultSource: "FXStreet",
  },
  {
    url: "https://www.mining.com/tag/gold/feed/",
    defaultSource: "Mining.com",
  },
  {
    url: "https://news.google.com/rss/search?q=site:dailyfx.com+gold+OR+XAU+forecast&hl=en-US&gl=US&ceid=US:en",
    defaultSource: "DailyFX",
  },
  {
    url: "https://news.google.com/rss/search?q=%22World+Gold+Council%22+OR+site:gold.org&hl=en-US&gl=US&ceid=US:en",
    defaultSource: "World Gold Council",
  },
  {
    url: "https://news.google.com/rss/search?q=site:bullionvault.com+gold+news&hl=en-US&gl=US&ceid=US:en",
    defaultSource: "BullionVault",
  },
  // --- Thai news sources ---
  {
    url: "https://www.infoquest.co.th/rss",
    defaultSource: "InfoQuest",
  },
  {
    url: "https://news.google.com/rss/search?q=site:thairath.co.th+ราคาทอง+OR+ทองคำ+OR+ตลาดทอง&hl=th&gl=TH&ceid=TH:th",
    defaultSource: "ไทยรัฐ",
  },
  {
    url: "https://news.google.com/rss/search?q=site:bangkokbiznews.com+ทองคำ+OR+ราคาทอง+OR+โลหะมีค่า&hl=th&gl=TH&ceid=TH:th",
    defaultSource: "กรุงเทพธุรกิจ",
  },
  {
    url: "https://news.google.com/rss/search?q=site:prachachat.net+ทองคำ+OR+ราคาทอง+OR+เศรษฐกิจ&hl=th&gl=TH&ceid=TH:th",
    defaultSource: "ประชาชาติธุรกิจ",
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

// Vercel Serverless: max 60s on Hobby plan
export const maxDuration = 60;

async function handleFetchNews(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!OPENROUTER_API_KEY) {
    return Response.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 500 });
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

    // 3. Filter new items (take more candidates, process until we get 3 new ones)
    const candidates = allItems
      .filter((item) => item.link && !existingUrls.has(item.link))
      .slice(0, 15);

    if (candidates.length === 0) {
      return Response.json({ message: "No new articles", count: 0 });
    }

    // 4. Fetch full article, translate, and save (stop after 3 successful)
    const results = [];
    let saved = 0;
    for (const item of candidates) {
      if (saved >= 3) break;
      try {
        // Fetch full article content from source
        const scraped = await scrapeArticle(item.link);
        const articleText = scraped.text || item.summary;
        const finalUrl = scraped.finalUrl || item.link;
        // Generate unique AI image from article title
        const imageUrl = scraped.ogImage || generateImageUrl(item.title, item.category);

        // Check if article is already in Thai (skip translation)
        const isThai = /[\u0E00-\u0E7F]/.test(item.title);
        let translated: { titleTh: string; summaryTh: string; bodyTh: string };
        if (isThai) {
          translated = { titleTh: item.title, summaryTh: item.summary, bodyTh: articleText || item.summary };
        } else {
          try {
            translated = await translateWithClaude(item.title, articleText);
          } catch {
            // Fallback: use English if translation API fails
            translated = { titleTh: item.title, summaryTh: item.summary, bodyTh: articleText || item.summary };
          }
        }

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
        saved++;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown";
        if (msg.includes("UNIQUE constraint") || msg.includes("Unique constraint")) {
          continue; // Skip duplicates silently
        }
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

// ---- AI Image Generation via Pollinations.ai (free, no API key) ----

function generateImageUrl(title: string, category: string): string {
  const baseStyle = "photorealistic, professional financial news thumbnail, dark moody background, cinematic lighting, no text no letters no words";
  const subject = category === "silver"
    ? "silver bars and silver coins, metallic silver tones"
    : "gold bars and gold coins, warm golden tones";

  // Create a prompt from the article title
  const cleanTitle = title
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .slice(0, 80);

  const prompt = `${subject}, ${cleanTitle}, ${baseStyle}`;
  const encoded = encodeURIComponent(prompt);

  // Use a seed based on title hash for consistent images
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

// ---- Translation ----

async function translateWithClaude(
  titleEn: string,
  articleText: string
): Promise<{ titleTh: string; summaryTh: string; bodyTh: string }> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
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
    throw new Error(`OpenRouter API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in response");
  return JSON.parse(jsonMatch[0]);
}
