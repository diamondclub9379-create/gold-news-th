"use client";

import { useEffect, useState } from "react";

interface PriceInfo {
  price: string;
  change: number;
  changePercent: number;
}

interface PriceData {
  gold: PriceInfo | null;
  silver: PriceInfo | null;
}

function getStoredRef(key: string): number | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const { price, date } = JSON.parse(stored);
    // Reset if stored date is not today
    const today = new Date().toDateString();
    if (date !== today) return null;
    return price;
  } catch {
    return null;
  }
}

function storeRef(key: string, price: number) {
  try {
    const today = new Date().toDateString();
    // Only store if no reference exists for today
    if (!getStoredRef(key)) {
      localStorage.setItem(key, JSON.stringify({ price, date: today }));
    }
  } catch {
    // ignore
  }
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

          const goldPrice = data.gold?.price ? parseFloat(data.gold.price) : null;
          const silverPrice = data.silver?.price ? parseFloat(data.silver.price) : null;

          // Store first price of the day as reference
          if (goldPrice) storeRef("gold_ref", goldPrice);
          if (silverPrice) storeRef("silver_ref", silverPrice);

          const goldRef = getStoredRef("gold_ref");
          const silverRef = getStoredRef("silver_ref");

          setPrices({
            gold: goldPrice
              ? {
                  price: goldPrice.toFixed(2),
                  change: goldRef ? goldPrice - goldRef : 0,
                  changePercent: goldRef ? ((goldPrice - goldRef) / goldRef) * 100 : 0,
                }
              : null,
            silver: silverPrice
              ? {
                  price: silverPrice.toFixed(2),
                  change: silverRef ? silverPrice - silverRef : 0,
                  changePercent: silverRef
                    ? ((silverPrice - silverRef) / silverRef) * 100
                    : 0,
                }
              : null,
          });
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
        data={prices.gold}
        color="yellow"
      />
      <PriceCard
        label="เงิน"
        symbol="XAG/USD"
        icon="Ag"
        data={prices.silver}
        color="gray"
      />
    </div>
  );
}

function PriceCard({
  label,
  symbol,
  icon,
  data,
  color,
}: {
  label: string;
  symbol: string;
  icon: string;
  data: PriceInfo | null;
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

  const isUp = data && data.change > 0;
  const isDown = data && data.change < 0;
  const changeColor = isUp
    ? "text-green-400"
    : isDown
      ? "text-red-400"
      : "text-gray-500";

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
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-bold text-gray-50">
          {data ? `$${Number(data.price).toLocaleString()}` : "$—"}
        </span>
        {data && data.change !== 0 && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${changeColor}`}>
            {isUp ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {isUp ? "+" : ""}{data.change.toFixed(2)} ({isUp ? "+" : ""}{data.changePercent.toFixed(2)}%)
          </span>
        )}
        {data && data.change === 0 && (
          <span className="text-[10px] text-gray-600">USD/oz</span>
        )}
      </div>
    </div>
  );
}
