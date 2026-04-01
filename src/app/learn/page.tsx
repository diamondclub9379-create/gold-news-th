import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "คลังความรู้ - เรียนรู้การเทรดทองคำและเงิน",
  description:
    "บทความสอนเทรดทองคำ เงิน Forex สำหรับมือใหม่และมืออาชีพ เรียนรู้ฟรี",
};

const articles = [
  {
    slug: "how-to-trade-gold",
    title: "วิธีเทรดทองคำ (XAU/USD) สำหรับมือใหม่ ฉบับสมบูรณ์ 2026",
    summary:
      "เรียนรู้ขั้นตอนเทรดทองคำตั้งแต่เปิดบัญชี เลือก Broker ไปจนถึงเทคนิคทำกำไร",
    icon: "📖",
    tag: "มือใหม่",
    tagColor: "bg-green-500/15 text-green-400 border-green-500/20",
  },
  {
    slug: "gold-vs-silver",
    title: "ทองคำ vs เงิน เทรดอันไหนดีกว่า?",
    summary:
      "เปรียบเทียบข้อดี-ข้อเสียของทองคำและเงิน ใครเหมาะกับนักเทรดแบบไหน",
    icon: "⚖️",
    tag: "เปรียบเทียบ",
    tagColor: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  },
  {
    slug: "factors-affecting-gold-price",
    title: "5 ปัจจัยที่ส่งผลต่อราคาทองคำ ที่นักเทรดต้องรู้",
    summary:
      "เข้าใจปัจจัยพื้นฐานที่ขับเคลื่อนราคาทอง ตั้งแต่ดอกเบี้ย Fed ไปจนถึงภูมิรัฐศาสตร์",
    icon: "🔍",
    tag: "วิเคราะห์",
    tagColor: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  },
  {
    slug: "risk-management",
    title: "บริหารความเสี่ยงอย่างไร ไม่ให้ล้างพอร์ต",
    summary:
      "เทคนิค Money Management, การตั้ง Stop Loss, และกฎ 1-2% ที่มืออาชีพใช้",
    icon: "🛡️",
    tag: "บริหารเงิน",
    tagColor: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  },
  {
    slug: "exness-vs-xm",
    title: "Exness vs XM เลือก Broker ไหนดี? เปรียบเทียบละเอียด",
    summary:
      "เปรียบเทียบค่าสเปรด Leverage การฝากถอน และความน่าเชื่อถือแบบตัวต่อตัว",
    icon: "🏆",
    tag: "รีวิว Broker",
    tagColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  },
];

export default function LearnPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full" />
          <h1 className="text-3xl font-bold text-gray-50">คลังความรู้</h1>
        </div>
        <p className="text-gray-400 ml-4">
          เรียนรู้การเทรดทองคำและเงินจากศูนย์ สู่การทำกำไรอย่างมืออาชีพ
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/learn/${article.slug}`}
            className="block group"
          >
            <article className="h-full bg-gray-900/80 border border-gray-800/80 rounded-xl p-5 hover:border-yellow-700/40 hover:bg-gray-900 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-900/5">
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0 mt-1">
                  {article.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${article.tagColor}`}
                    >
                      {article.tag}
                    </span>
                  </div>
                  <h2 className="text-[15px] font-semibold text-gray-100 group-hover:text-yellow-400 transition-colors leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    {article.summary}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-yellow-600 group-hover:text-yellow-400 transition-colors mt-3">
                    อ่านบทความ
                    <svg
                      className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-br from-gray-900 via-gray-900 to-yellow-950/20 border border-yellow-700/20 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-gray-50 mb-2">
          พร้อมเริ่มเทรดทองคำแล้ว?
        </h3>
        <p className="text-gray-400 mb-5">
          เปิดบัญชีกับ Broker ที่เราแนะนำ เริ่มต้นง่าย ฝากถอนสะดวก
        </p>
        <Link
          href="/brokers"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-yellow-500/20 hover:scale-[1.02] transition-all"
        >
          ดู Broker ที่แนะนำ
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
