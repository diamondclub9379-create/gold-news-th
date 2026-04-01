"use client";

import { useEffect, useState } from "react";

interface PriceInfo {
  price: string;
  prevClose: string;
  change: string;
  changePercent: string;
  high: string | null;
  low: string | null;
}

interface PriceData {
  gold: PriceInfo | null;
  silver: PriceInfo | null;
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
        <div className="h-28 bg-gray-800/50 rounded-xl" />
        <div className="h-28 bg-gray-800/50 rounded-xl" />
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

  const change = data ? parseFloat(data.change) : 0;
  const isUp = change > 0;
  const isDown = change < 0;
  const changeColor = isUp
    ? "text-green-400"
    : isDown
      ? "text-red-400"
      : "text-gray-500";
  const changeBg = isUp
    ? "bg-green-500/10"
    : isDown
      ? "bg-red-500/10"
      : "bg-gray-500/10";

  return (
    <div
      className={`bg-gradient-to-br ${borderColor} to-transparent border rounded-xl p-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
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
        {data && change !== 0 && (
          <span
            className={`text-[11px] font-semibold flex items-center gap-0.5 px-2 py-0.5 rounded-full ${changeBg} ${changeColor}`}
          >
            {isUp ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {isUp ? "+" : ""}
            {data.changePercent}%
          </span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-gray-50">
          {data ? `$${Number(data.price).toLocaleString()}` : "$—"}
        </span>
        {data && change !== 0 && (
          <span className={`text-xs font-medium ${changeColor}`}>
            {isUp ? "+" : ""}
            {Number(data.change).toLocaleString()}
          </span>
        )}
      </div>

      {/* High / Low bar */}
      {data?.high && data?.low && (
        <div className="mt-1">
          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>ต่ำสุด ${Number(data.low).toLocaleString()}</span>
            <span>สูงสุด ${Number(data.high).toLocaleString()}</span>
          </div>
          <div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <PriceBar
              low={parseFloat(data.low)}
              high={parseFloat(data.high)}
              current={parseFloat(data.price)}
              color={color}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PriceBar({
  low,
  high,
  current,
  color,
}: {
  low: number;
  high: number;
  current: number;
  color: "yellow" | "gray";
}) {
  const range = high - low;
  const position = range > 0 ? ((current - low) / range) * 100 : 50;
  const clamped = Math.min(Math.max(position, 2), 98);

  const barColor =
    color === "yellow"
      ? "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
      : "bg-gradient-to-r from-red-500 via-gray-400 to-green-500";

  return (
    <>
      <div className={`absolute inset-0 ${barColor} opacity-40`} />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md border-2 border-gray-900"
        style={{ left: `${clamped}%`, transform: `translate(-50%, -50%)` }}
      />
    </>
  );
}
