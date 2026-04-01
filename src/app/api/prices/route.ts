export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Try metals.dev API
    const res = await fetch(
      "https://api.metals.dev/v1/latest?api_key=demo&currency=USD&unit=toz",
      { next: { revalidate: 60 } }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.metals) {
        return Response.json({
          gold: {
            price: data.metals.gold?.toFixed(2) || null,
            change: "",
            changePercent: "",
          },
          silver: {
            price: data.metals.silver?.toFixed(2) || null,
            change: "",
            changePercent: "",
          },
          source: "metals.dev",
          timestamp: new Date().toISOString(),
        });
      }
    }
  } catch {
    // fallback
  }

  return Response.json({
    gold: null,
    silver: null,
    source: "unavailable",
    timestamp: new Date().toISOString(),
  });
}
