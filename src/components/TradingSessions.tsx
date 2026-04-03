"use client";

import { useEffect, useState } from "react";

interface Session {
  name: string;
  city: string;
  tz: string;
  openHour: number;   // local open hour
  closeHour: number;  // local close hour
  color: string;
  bgColor: string;
}

const SESSIONS: Session[] = [
  { name: "Sydney", city: "ซิดนีย์", tz: "Australia/Sydney", openHour: 7, closeHour: 16, color: "text-blue-400", bgColor: "bg-blue-500" },
  { name: "Tokyo", city: "โตเกียว", tz: "Asia/Tokyo", openHour: 9, closeHour: 18, color: "text-purple-400", bgColor: "bg-purple-500" },
  { name: "London", city: "ลอนดอน", tz: "Europe/London", openHour: 8, closeHour: 17, color: "text-green-400", bgColor: "bg-green-500" },
  { name: "New York", city: "นิวยอร์ก", tz: "America/New_York", openHour: 8, closeHour: 17, color: "text-amber-400", bgColor: "bg-amber-500" },
];

function getLocalTime(tz: string): string {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: tz,
  });
}

function getLocalHour(tz: string): number {
  const h = new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: tz });
  return parseInt(h);
}

function isSessionOpen(session: Session): boolean {
  const hour = getLocalHour(session.tz);
  if (session.openHour < session.closeHour) {
    return hour >= session.openHour && hour < session.closeHour;
  }
  // Wraps around midnight
  return hour >= session.openHour || hour < session.closeHour;
}

// Convert session hours to a 24h timeline position (0-100%) based on UTC
function getBarPosition(session: Session): { left: number; width: number } {
  // Convert local open/close to UTC-equivalent hour for timeline display
  const now = new Date();

  const openDate = new Date(now.toLocaleString("en-US", { timeZone: session.tz }));
  openDate.setHours(session.openHour, 0, 0, 0);

  const closeDate = new Date(now.toLocaleString("en-US", { timeZone: session.tz }));
  closeDate.setHours(session.closeHour, 0, 0, 0);

  // Convert to Bangkok time for consistent display
  const bangkokOpen = parseInt(
    openDate.toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: "Asia/Bangkok" })
  );
  const bangkokClose = parseInt(
    closeDate.toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: "Asia/Bangkok" })
  );

  const left = (bangkokOpen / 24) * 100;
  let width = ((bangkokClose - bangkokOpen) / 24) * 100;
  if (width < 0) width += 100; // Wrap around midnight
  if (width === 0) width = (9 / 24) * 100; // Default 9 hours

  return { left: Math.max(0, left), width: Math.min(width, 100 - left) };
}

export default function TradingSessions() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Current Bangkok time marker
  const bangkokHour = getLocalHour("Asia/Bangkok");
  const bangkokMin = parseInt(
    new Date().toLocaleString("en-US", { minute: "numeric", timeZone: "Asia/Bangkok" })
  );
  const currentPos = ((bangkokHour + bangkokMin / 60) / 24) * 100;

  return (
    <div className="border border-gray-700 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 px-3 py-2 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-gray-300">
          Sessions
        </span>
        <span className="font-mono text-[10px] text-gray-500">
          BKK {getLocalTime("Asia/Bangkok")}
        </span>
      </div>

      {/* Timeline */}
      <div className="px-3 pt-3 pb-1">
        {/* Hour labels */}
        <div className="flex justify-between mb-1">
          {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
            <span key={h} className="font-mono text-[9px] text-gray-700 w-6 text-center">
              {h.toString().padStart(2, "0")}
            </span>
          ))}
        </div>

        {/* Timeline bars */}
        <div className="relative h-1 bg-gray-800 rounded-full mb-3">
          {/* Current time marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-3 bg-white rounded-full z-10"
            style={{ left: `${currentPos}%` }}
          />
        </div>
      </div>

      {/* Session list */}
      <div className="divide-y divide-gray-800/60">
        {SESSIONS.map((session) => {
          const open = isSessionOpen(session);
          const localTime = getLocalTime(session.tz);
          const bar = getBarPosition(session);

          return (
            <div key={session.name} className="px-3 py-2 flex items-center gap-3">
              {/* Status dot */}
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${open ? "bg-green-500" : "bg-gray-700"}`} />

              {/* Name + time */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[12px] font-medium ${open ? session.color : "text-gray-600"}`}>
                    {session.name}
                  </span>
                  <span className={`font-mono text-[11px] ${open ? "text-gray-300" : "text-gray-600"}`}>
                    {localTime}
                  </span>
                </div>

                {/* Mini bar */}
                <div className="relative h-1 bg-gray-800 rounded-full mt-1.5">
                  <div
                    className={`absolute h-full rounded-full ${open ? session.bgColor : "bg-gray-700"} ${open ? "opacity-80" : "opacity-30"}`}
                    style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
