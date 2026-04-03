export const dynamic = "force-dynamic";

const FF_CALENDAR_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";

interface FFEvent {
  title: string;
  country: string;
  date: string;
  impact: string;
  forecast: string;
  previous: string;
}

// Simple in-memory cache (5 min)
let cache: { data: FFEvent[]; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function GET() {
  try {
    let events: FFEvent[];

    if (cache && Date.now() - cache.ts < CACHE_TTL) {
      events = cache.data;
    } else {
      const res = await fetch(FF_CALENDAR_URL, {
        signal: AbortSignal.timeout(10000),
        headers: { "User-Agent": "GoldNewsTH/1.0" },
      });
      if (!res.ok) throw new Error(`FF API error: ${res.status}`);
      events = await res.json();
      cache = { data: events, ts: Date.now() };
    }

    // Filter today's events (in user's perspective — use UTC date matching)
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD

    const todayEvents = events
      .filter((e) => {
        const eventDate = new Date(e.date);
        const eventStr = eventDate.toISOString().slice(0, 10);
        return eventStr === todayStr;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return Response.json({
      events: todayEvents,
      date: todayStr,
      total: todayEvents.length,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown";
    return Response.json({ events: [], date: "", total: 0, error: msg });
  }
}
