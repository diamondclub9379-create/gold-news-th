"use client";

import { useEffect, useState } from "react";

interface PriceData {
  gold: { price: string } | null;
  silver: { price: string } | null;
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
        const res = await fetch("/api/prices");
        if (res.ok) {
          const data = await res.json();
          setPrices(data);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 animate-pulse">
        <div className="h-20 bg-gray-800/50 rounded-xl" />
        <div className="h-20 bg-gray-800/50 rounded-xl" />
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
        color="yellow"
      />
      <PriceCard
        label="เงิน"
        symbol="XAG/USD"
        icon="Ag"
        price={prices.silver?.price}
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
  color,
}: {
  label: string;
  symbol: string;
  icon: string;
  price?: string;
  color: "yellow" | "gray";
}) {
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
        <span className="text-2xl font-bold text-gray-50">
          {price ? `$${Number(price).toLocaleString()}` : "$—"}
        </span>
        <span className="text-[10px] text-gray-600">USD/oz</span>
      </div>
    </div>
  );
}
