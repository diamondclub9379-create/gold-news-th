export const dynamic = "force-dynamic";

// Swissquote pairs (free, real-time, no API key)
const SWISSQUOTE_PAIRS = [
  { key: "gold", pair: "XAU/USD", label: "Gold/USD", icon: "Au", decimals: 2 },
  { key: "silver", pair: "XAG/USD", label: "Silver/USD", icon: "Ag", decimals: 3 },
  { key: "eurusd", pair: "EUR/USD", label: "EUR/USD", icon: "€", decimals: 5 },
  { key: "gbpusd", pair: "GBP/USD", label: "GBP/USD", icon: "£", decimals: 5 },
  { key: "usdjpy", pair: "USD/JPY", label: "USD/JPY", icon: "¥", decimals: 3 },
  { key: "usdchf", pair: "USD/CHF", label: "USD/CHF", icon: "Fr", decimals: 5 },
];

// Yahoo fallback pairs (for assets Swissquote doesn't have)
const YAHOO_PAIRS = [
  { key: "dxy", symbol: "DX-Y.NYB", label: "DXY", icon: "$", decimals: 2 },
  { key: "oil", symbol: "CL=F", label: "Oil/WTI", icon: "🛢", decimals: 2 },
  { key: "btc", symbol: "BTC-USD", label: "BTC/USD", icon: "₿", decimals: 2 },
];

export async function GET() {
  try {
    const [swissResults, yahooResults] = await Promise.all([
      fetchSwissquotePairs(),
      fetchYahooPairs(),
    ]);

    const pairs = [...swissResults, ...yahooResults];

    // Legacy compat
    const goldItem = pairs.find((r) => r.key === "gold");
    const silverItem = pairs.find((r) => r.key === "silver");

    return Response.json({
      pairs,
      gold: goldItem?.data || null,
      silver: silverItem?.data || null,
      source: "swissquote+yahoo",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return Response.json({
      pairs: [],
      gold: null,
      silver: null,
      source: "unavailable",
      timestamp: new Date().toISOString(),
    });
  }
}

// ---- Swissquote (real-time forex + precious metals) ----

async function fetchSwissquotePairs() {
  return Promise.all(
    SWISSQUOTE_PAIRS.map(async ({ key, pair, label, icon, decimals }) => {
      try {
        const res = await fetch(
          `https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/${pair}`,
          { signal: AbortSignal.timeout(5000) }
        );
        const json = await res.json();
        const prices = json[0]?.spreadProfilePrices?.[0];
        if (!prices?.bid) return { key, label, icon, data: null };

        const bid = prices.bid;

        return {
          key,
          label,
          icon,
          data: {
            price: bid.toFixed(decimals),
            prevClose: "0",
            change: "0",
            changePercent: "0.00",
            high: null,
            low: null,
            // Swissquote provides live bid — no daily change data
            // We show the live price; change will be calculated client-side
            ask: prices.ask?.toFixed(decimals) || null,
            spread: calcSpread(key, prices.bid, prices.ask),
          },
        };
      } catch {
        return { key, label, icon, data: null };
      }
    })
  );
}

function calcSpread(key: string, bid: number, ask: number): string {
  const diff = ask - bid;
  // Gold/Silver: show in dollars
  if (key === "gold" || key === "silver") return diff.toFixed(2);
  // JPY pairs: pips = diff * 100
  if (key === "usdjpy") return (diff * 100).toFixed(1);
  // Other forex: pips = diff * 10000
  return (diff * 10000).toFixed(1);
}

// ---- Yahoo Finance (DXY, Oil, BTC - with daily change) ----

async function fetchYahooPairs() {
  return Promise.all(
    YAHOO_PAIRS.map(async ({ key, symbol, label, icon, decimals }) => {
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`,
          { signal: AbortSignal.timeout(5000) }
        );
        const data = await res.json();
        const meta = data.chart?.result?.[0]?.meta;
        if (!meta?.regularMarketPrice) return { key, label, icon, data: null };

        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || 0;
        const change = prevClose ? price - prevClose : 0;
        const changePercent = prevClose ? (change / prevClose) * 100 : 0;

        return {
          key,
          label,
          icon,
          data: {
            price: price.toFixed(decimals),
            prevClose: prevClose.toFixed(decimals),
            change: change.toFixed(decimals),
            changePercent: changePercent.toFixed(2),
            high: meta.regularMarketDayHigh?.toFixed(decimals) || null,
            low: meta.regularMarketDayLow?.toFixed(decimals) || null,
          },
        };
      } catch {
        return { key, label, icon, data: null };
      }
    })
  );
}
