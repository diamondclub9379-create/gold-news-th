"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "หน้าแรก" },
  { href: "/category/gold", label: "ทองคำ" },
  { href: "/category/silver", label: "เงิน" },
  { href: "/videos", label: "วิดีโอ" },
  { href: "/learn", label: "คลังความรู้" },
  { href: "/brokers", label: "Brokers" },
];

export default function Header() {
  const pathname = usePathname();
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Row 1: Brand + Clock */}
      <div className="bg-black px-4 py-1.5 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-amber-400 tracking-wide">
              GOLD NEWS TH
            </span>
            <span className="font-mono text-[10px] text-gray-600 hidden sm:inline">
              สรุปตลาดทอง ก่อนใคร
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-gray-500">
              {time}
            </span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Row 2: Navigation */}
      <nav className="bg-gray-950 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center overflow-x-auto">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2.5 text-[12px] font-mono uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "text-amber-400 border-amber-400"
                    : "text-gray-500 border-transparent hover:text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
