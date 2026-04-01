export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [goldRes, silverRes] = await Promise.all([
      fetch(
        "https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD"
      ),
      fetch(
        "https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAG/USD"
      ),
    ]);

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();

    const goldPrice = goldData[0]?.spreadProfilePrices?.[0];
    const silverPrice = silverData[0]?.spreadProfilePrices?.[0];

    const goldMid = goldPrice
      ? ((goldPrice.bid + goldPrice.ask) / 2).toFixed(2)
      : null;
    const silverMid = silverPrice
      ? ((silverPrice.bid + silverPrice.ask) / 2).toFixed(2)
      : null;

    return Response.json({
      gold: goldMid ? { price: goldMid } : null,
      silver: silverMid ? { price: silverMid } : null,
      source: "swissquote",
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
