export const dynamic = "force-dynamic";

const SYMBOLS = [
  { key: "gold", symbol: "GC=F", label: "Gold/USD", icon: "Au" },
  { key: "silver", symbol: "SI=F", label: "Silver/USD", icon: "Ag" },
  { key: "eurusd", symbol: "EURUSD=X", label: "EUR/USD", icon: "€" },
  { key: "gbpusd", symbol: "GBPUSD=X", label: "GBP/USD", icon: "£" },
  { key: "usdjpy", symbol: "JPY=X", label: "USD/JPY", icon: "¥" },
  { key: "dxy", symbol: "DX-Y.NYB", label: "DXY", icon: "$" },
  { key: "oil", symbol: "CL=F", label: "Oil/WTI", icon: "🛢" },
  { key: "btc", symbol: "BTC-USD", label: "BTC/USD", icon: "₿" },
];

export async function GET() {
  try {
    const results = await Promise.all(
      SYMBOLS.map(async ({ key, symbol, label, icon }) => {
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

          // Determine decimal places based on asset type
          const decimals = key === "gold" || key === "oil" ? 2
            : key === "silver" ? 3
            : key === "btc" || key === "dxy" ? 2
            : key === "usdjpy" ? 3 : 5;

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

    // Also return legacy format for backward compat
    const goldItem = results.find((r) => r.key === "gold");
    const silverItem = results.find((r) => r.key === "silver");

    return Response.json({
      pairs: results,
      gold: goldItem?.data || null,
      silver: silverItem?.data || null,
      source: "yahoo",
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
