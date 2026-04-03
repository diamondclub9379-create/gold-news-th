import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return true;
  }
  return request.headers.get("x-api-secret") === process.env.API_SECRET;
}

export async function GET(request: NextRequest) {
  return handleFetchYouTube(request);
}

export async function POST(request: NextRequest) {
  return handleFetchYouTube(request);
}

async function handleFetchYouTube(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!YOUTUBE_CHANNEL_ID) {
    return Response.json({ error: "YOUTUBE_CHANNEL_ID not configured" }, { status: 500 });
  }

  try {
    // Fetch YouTube RSS feed
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
    const rssRes = await fetch(rssUrl, {
      headers: { "User-Agent": "GoldNewsTH/1.0" },
      signal: AbortSignal.timeout(15000),
    });

    if (!rssRes.ok) {
      return Response.json({ error: `YouTube RSS fetch failed: ${rssRes.status}` }, { status: 502 });
    }

    const rssText = await rssRes.text();
    const videos = parseYouTubeAtom(rssText);

    if (videos.length === 0) {
      return Response.json({ message: "No videos found in feed", count: 0 });
    }

    // Get existing video IDs to deduplicate
    const existing = await prisma.video.findMany({
      select: { videoId: true },
    });
    const existingIds = new Set(existing.map((v) => v.videoId));

    // Filter new videos
    const newVideos = videos.filter((v) => !existingIds.has(v.videoId));

    if (newVideos.length === 0) {
      return Response.json({ message: "No new videos", count: 0 });
    }

    // Save new videos
    const results = [];
    for (const video of newVideos) {
      try {
        const saved = await prisma.video.create({
          data: {
            videoId: video.videoId,
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            channelTitle: video.channelTitle,
            publishedAt: new Date(video.publishedAt),
          },
        });
        results.push({ status: "ok", title: video.title.slice(0, 60), id: saved.id });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown";
        if (msg.includes("Unique constraint")) continue;
        results.push({ status: "error", title: video.title.slice(0, 60), error: msg });
      }
    }

    return Response.json({ message: "Done", count: results.length, results });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown";
    return Response.json({ error: msg }, { status: 500 });
  }
}

// ---- YouTube Atom Feed Parsing ----

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
}

function parseYouTubeAtom(xml: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];

  // Extract channel title from feed-level <title>
  const feedTitleMatch = xml.match(/<feed[^>]*>[\s\S]*?<title>([\s\S]*?)<\/title>/);
  const channelTitle = feedTitleMatch?.[1]?.trim() || "คนตื่นทอง";

  // Extract entries
  const entryMatches = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || [];

  for (const entryXml of entryMatches) {
    const videoIdMatch = entryXml.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/);
    const titleMatch = entryXml.match(/<title>([\s\S]*?)<\/title>/);
    const publishedMatch = entryXml.match(/<published>([\s\S]*?)<\/published>/);
    const descMatch = entryXml.match(/<media:description>([\s\S]*?)<\/media:description>/);

    if (!videoIdMatch || !titleMatch) continue;

    const videoId = videoIdMatch[1].trim();
    const title = titleMatch[1].trim();
    const description = (descMatch?.[1]?.trim() || "").slice(0, 500);
    const publishedAt = publishedMatch?.[1]?.trim() || new Date().toISOString();
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    videos.push({
      videoId,
      title,
      description,
      thumbnailUrl,
      channelTitle,
      publishedAt,
    });
  }

  return videos;
}
