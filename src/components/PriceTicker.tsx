"use client";

import { useEffect, useState } from "react";

interface PriceInfo {
  price: string;
  prevClose: string;
  change: string;
  changePercent: string;
  high: string | null;
  low: string | null;
  ask?: string | null;
  spread?: string | null;
}

interface PairData {
  key: string;
  label: string;
  icon: string;
  data: PriceInfo | null;
}

export default function PriceTicker() {
  const [pairs, setPairs] = useState<PairData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        if (res.ok) {
          const json = await res.json();
          if (json.pairs) setPairs(json.pairs);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-20 bg-gray-800/50 rounded-xl animate-pulse" />
    );
  }

  if (pairs.length === 0) return null;

  return (
    <div className="border border-gray-700/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-bold text-white tracking-wide">
          ตลาดวันนี้
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-blue-200 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900/80 border-b border-gray-700/50">
              <th className="text-left px-4 py-2 text-[11px] font-medium text-gray-400 w-36">สินทรัพย์</th>
              <th className="text-right px-3 py-2 text-[11px] font-medium text-gray-400">Bid</th>
              <th className="text-right px-3 py-2 text-[11px] font-medium text-gray-400 hidden sm:table-cell">Ask</th>
              <th className="text-right px-3 py-2 text-[11px] font-medium text-gray-400">เปลี่ยนแปลง</th>
              <th className="text-right px-3 py-2 text-[11px] font-medium text-gray-400">%</th>
              <th className="text-right px-3 py-2 text-[11px] font-medium text-gray-400 hidden md:table-cell">สูงสุด</th>
              <th className="text-right px-4 py-2 text-[11px] font-medium text-gray-400 hidden md:table-cell">ต่ำสุด</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair, i) => (
              <PriceRow key={pair.key} pair={pair} isLast={i === pairs.length - 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PriceRow({ pair, isLast }: { pair: PairData; isLast: boolean }) {
  const { label, icon, data } = pair;
  const borderClass = isLast ? "" : "border-b border-gray-800/60";

  if (!data) {
    return (
      <tr className={`bg-gray-950/50 ${borderClass}`}>
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base">{icon}</span>
            <span className="text-gray-300 font-medium text-[13px]">{label}</span>
          </div>
        </td>
        <td colSpan={6} className="text-center text-gray-600 text-xs px-3 py-2.5">—</td>
      </tr>
    );
  }

  const change = parseFloat(data.change);
  const hasChange = change !== 0;
  const isUp = change > 0;
  const isDown = change < 0;

  const changeColor = isUp ? "text-green-400" : isDown ? "text-red-400" : "text-gray-500";
  const changeBg = isUp ? "bg-green-500/8" : isDown ? "bg-red-500/8" : "";
  const rowBg = isUp ? "hover:bg-green-950/20" : isDown ? "hover:bg-red-950/20" : "hover:bg-gray-800/30";
  const arrow = isUp ? "▲" : isDown ? "▼" : "";

  return (
    <tr className={`bg-gray-950/50 ${rowBg} ${borderClass} transition-colors`}>
      {/* Asset name */}
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{icon}</span>
          <span className="text-gray-200 font-medium text-[13px]">{label}</span>
        </div>
      </td>

      {/* Bid */}
      <td className="text-right px-3 py-2.5">
        <span className="text-gray-100 font-mono font-semibold text-[14px]">
          {formatPrice(pair.key, data.price)}
        </span>
      </td>

      {/* Ask */}
      <td className="text-right px-3 py-2.5 hidden sm:table-cell">
        <span className="text-gray-400 font-mono text-[13px]">
          {data.ask ? formatPrice(pair.key, data.ask) : "—"}
        </span>
      </td>

      {/* Change */}
      <td className={`text-right px-3 py-2.5 ${changeBg}`}>
        {hasChange ? (
          <span className={`font-mono text-[13px] font-medium ${changeColor}`}>
            {arrow} {isUp ? "+" : ""}{data.change}
          </span>
        ) : (
          <span className="text-gray-600 text-[12px]">
            {data.spread ? `sp: ${data.spread}` : "—"}
          </span>
        )}
      </td>

      {/* % Change */}
      <td className={`text-right px-3 py-2.5 ${changeBg}`}>
        {hasChange ? (
          <span className={`inline-flex items-center font-mono text-[12px] font-semibold px-1.5 py-0.5 rounded ${
            isUp ? "bg-green-500/15 text-green-400"
            : isDown ? "bg-red-500/15 text-red-400"
            : "text-gray-500"
          }`}>
            {isUp ? "+" : ""}{data.changePercent}%
          </span>
        ) : (
          <span className="text-gray-600 text-[12px]">—</span>
        )}
      </td>

      {/* High */}
      <td className="text-right px-3 py-2.5 hidden md:table-cell">
        <span className="text-gray-400 font-mono text-[12px]">
          {data.high ? formatPrice(pair.key, data.high) : "—"}
        </span>
      </td>

      {/* Low */}
      <td className="text-right px-4 py-2.5 hidden md:table-cell">
        <span className="text-gray-400 font-mono text-[12px]">
          {data.low ? formatPrice(pair.key, data.low) : "—"}
        </span>
      </td>
    </tr>
  );
}

function formatPrice(key: string, price: string): string {
  const num = Number(price);
  if (key === "gold" || key === "oil" || key === "btc" || key === "dxy") {
    return "$" + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (key === "silver") {
    return "$" + num.toFixed(3);
  }
  return num.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 5 });
}
