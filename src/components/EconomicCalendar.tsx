"use client";

import { useEffect, useState } from "react";

interface CalendarEvent {
  title: string;
  country: string;
  date: string;
  impact: string;
  forecast: string;
  previous: string;
}

export default function EconomicCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const res = await fetch("/api/calendar");
        if (res.ok) {
          const json = await res.json();
          setEvents(json.events || []);
          setDateStr(json.date || "");
        }
      } catch {
        // ignore
      }
      setLoading(false);
    }
    fetchCalendar();
  }, []);

  if (loading) {
    return <div className="h-16 bg-gray-900/50 rounded-sm animate-pulse" />;
  }

  const todayLabel = dateStr
    ? new Date(dateStr + "T00:00:00").toLocaleDateString("th-TH", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "วันนี้";

  return (
    <div className="border border-gray-700 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-gray-300">
            ปฏิทินเศรษฐกิจ
          </span>
          <span className="font-mono text-[10px] text-gray-500">
            {todayLabel}
          </span>
        </div>
        <span className="font-mono text-[10px] text-gray-500">
          {events.length} events
        </span>
      </div>

      {events.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <span className="font-mono text-[12px] text-gray-600">
            ไม่มีข่าวประกาศวันนี้
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900/80 border-b border-gray-700/50">
                <th className="text-left px-3 py-1.5 text-[10px] font-mono font-medium text-gray-500 w-16">เวลา</th>
                <th className="text-left px-2 py-1.5 text-[10px] font-mono font-medium text-gray-500 w-12">สกุล</th>
                <th className="text-center px-2 py-1.5 text-[10px] font-mono font-medium text-gray-500 w-8"></th>
                <th className="text-left px-3 py-1.5 text-[10px] font-mono font-medium text-gray-500">เหตุการณ์</th>
                <th className="text-right px-3 py-1.5 text-[10px] font-mono font-medium text-gray-500 hidden sm:table-cell w-20">คาดการณ์</th>
                <th className="text-right px-3 py-1.5 text-[10px] font-mono font-medium text-gray-500 hidden sm:table-cell w-20">ก่อนหน้า</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, i) => (
                <EventRow key={`${event.title}-${i}`} event={event} isLast={i === events.length - 1} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EventRow({ event, isLast }: { event: CalendarEvent; isLast: boolean }) {
  const borderClass = isLast ? "" : "border-b border-gray-800/60";

  const time = new Date(event.date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  });

  // Check if all-day event
  const eventDate = new Date(event.date);
  const isAllDay = eventDate.getHours() === 0 && eventDate.getMinutes() === 0;

  const impactColor =
    event.impact === "High"
      ? "bg-red-500"
      : event.impact === "Medium"
        ? "bg-amber-500"
        : "bg-gray-600";

  const currencyColor =
    event.country === "USD"
      ? "text-green-400"
      : event.country === "EUR"
        ? "text-blue-400"
        : event.country === "GBP"
          ? "text-red-400"
          : event.country === "JPY"
            ? "text-purple-400"
            : event.country === "AUD"
              ? "text-yellow-400"
              : "text-gray-400";

  return (
    <tr className={`bg-gray-950/50 hover:bg-gray-900/50 transition-colors ${borderClass}`}>
      <td className="px-3 py-2">
        <span className="font-mono text-[11px] text-gray-500">
          {isAllDay ? "All Day" : time}
        </span>
      </td>
      <td className="px-2 py-2">
        <span className={`font-mono text-[11px] font-bold ${currencyColor}`}>
          {event.country}
        </span>
      </td>
      <td className="px-2 py-2 text-center">
        <span className={`inline-block w-2.5 h-2.5 rounded-sm ${impactColor}`} title={event.impact} />
      </td>
      <td className="px-3 py-2">
        <span className="text-[12px] text-gray-200">{event.title}</span>
      </td>
      <td className="text-right px-3 py-2 hidden sm:table-cell">
        <span className="font-mono text-[11px] text-gray-400">
          {event.forecast || "—"}
        </span>
      </td>
      <td className="text-right px-3 py-2 hidden sm:table-cell">
        <span className="font-mono text-[11px] text-gray-500">
          {event.previous || "—"}
        </span>
      </td>
    </tr>
  );
}
