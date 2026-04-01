export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [goldRes, silverRes] = await Promise.all([
      fetch(
        "https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=2d"
      ),
      fetch(
        "https://query1.finance.yahoo.com/v8/finance/chart/SI=F?interval=1d&range=2d"
      ),
    ]);

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();

    const gm = goldData.chart?.result?.[0]?.meta;
    const sm = silverData.chart?.result?.[0]?.meta;

    function buildPrice(meta: Record<string, number> | undefined) {
      if (!meta?.regularMarketPrice) return null;
      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose || 0;
      const change = prevClose ? price - prevClose : 0;
      const changePercent = prevClose ? (change / prevClose) * 100 : 0;
      return {
        price: price.toFixed(2),
        prevClose: prevClose.toFixed(2),
        change: change.toFixed(2),
        changePercent: changePercent.toFixed(2),
        high: meta.regularMarketDayHigh?.toFixed(2) || null,
        low: meta.regularMarketDayLow?.toFixed(2) || null,
      };
    }

    return Response.json({
      gold: buildPrice(gm),
      silver: buildPrice(sm),
      source: "yahoo",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return Response.json({
      gold: null,
      silver: null,
      source: "unavailable",
      timestamp: new Date().toISOString(),
    });
  }
}
