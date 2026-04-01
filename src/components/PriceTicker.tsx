"use client";

import { useEffect, useState } from "react";

interface PriceData {
  gold: { price: string; change: string; changePercent: string } | null;
  silver: { price: string; change: string; changePercent: string } | null;
}

export default function PriceTicker() {
  const [prices, setPrices] = useState<PriceData>({
    gold: null,
    silver: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        // Use metals.dev free API
        const res = await fetch(
          "https://api.metals.dev/v1/latest?api_key=demo&currency=USD&unit=toz"
        );
        if (res.ok) {
          const data = await res.json();
          if (data.metals) {
            setPrices({
              gold: {
                price: data.metals.gold?.toFixed(2) || "—",
                change: "",
                changePercent: "",
              },
              silver: {
                price: data.metals.silver?.toFixed(2) || "—",
                change: "",
                changePercent: "",
              },
            });
            setLoading(false);
            return;
          }
        }
      } catch {
        // fallback
      }

      // Fallback: use goldapi.io or show placeholder
      try {
        const res = await fetch("/api/prices");
        if (res.ok) {
          const data = await res.json();
          setPrices(data);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }

      setLoading(false);
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 animate-pulse">
        <div className="h-16 bg-gray-800/50 rounded-xl flex-1" />
        <div className="h-16 bg-gray-800/50 rounded-xl flex-1" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <PriceCard
        label="ทองคำ"
        symbol="XAU/USD"
        icon="Au"
        price={prices.gold?.price}
        change={prices.gold?.change}
        changePercent={prices.gold?.changePercent}
        color="yellow"
      />
      <PriceCard
        label="เงิน"
        symbol="XAG/USD"
        icon="Ag"
        price={prices.silver?.price}
        change={prices.silver?.change}
        changePercent={prices.silver?.changePercent}
        color="gray"
      />
    </div>
  );
}

function PriceCard({
  label,
  symbol,
  icon,
  price,
  change,
  changePercent,
  color,
}: {
  label: string;
  symbol: string;
  icon: string;
  price?: string;
  change?: string;
  changePercent?: string;
  color: "yellow" | "gray";
}) {
  const isUp = change && !change.startsWith("-");
  const isDown = change && change.startsWith("-");
  const changeColor = isUp
    ? "text-green-400"
    : isDown
      ? "text-red-400"
      : "text-gray-500";

  const borderColor =
    color === "yellow"
      ? "border-yellow-700/30 from-yellow-950/20"
      : "border-gray-700/30 from-gray-800/20";

  const iconBg =
    color === "yellow"
      ? "bg-yellow-500/15 text-yellow-400"
      : "bg-gray-500/15 text-gray-300";

  return (
    <div
      className={`bg-gradient-to-br ${borderColor} to-transparent border rounded-xl p-4`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${iconBg}`}
        >
          {icon}
        </span>
        <div>
          <span className="text-xs text-gray-400">{label}</span>
          <span className="text-[10px] text-gray-600 ml-1">{symbol}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-gray-50">
          ${price || "—"}
        </span>
        {change && (
          <span className={`text-xs font-medium ${changeColor}`}>
            {isUp ? "+" : ""}
            {change}
            {changePercent ? ` (${isUp ? "+" : ""}${changePercent}%)` : ""}
          </span>
        )}
      </div>
    </div>
  );
}
