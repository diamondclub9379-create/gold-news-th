import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "แนะนำ Broker เทรดทองคำ-เงิน",
  description:
    "รวม Broker ที่ดีที่สุดสำหรับเทรดทองคำและเงินในไทย พร้อมรีวิวและเปรียบเทียบ",
};

const brokers = [
  {
    name: "Exness",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Exness_logo.svg/512px-Exness_logo.svg.png",
    description:
      "Broker ชั้นนำระดับโลก มีใบอนุญาตหลายประเทศ สเปรดต่ำ ฝากถอนเร็ว รองรับภาษาไทย",
    features: [
      "สเปรดเริ่มต้น 0.0 pips",
      "ฝากถอนทันทีผ่านธนาคารไทย",
      "Leverage สูงสุด 1:Unlimited",
      "รองรับ MT4, MT5",
      "มีใบอนุญาต FCA, CySEC, FSA",
    ],
    highlight: "ยอดนิยมอันดับ 1 ในไทย",
    href: "https://one.exnessonelink.com/a/tgeiigei",
    color: "from-yellow-500 to-amber-600",
  },
];

export default function BrokersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 mb-4">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <span className="text-xs text-yellow-400 font-medium">
            แนะนำโดย Gold News TH
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-50 mb-3">
          เปิดบัญชีเทรด{" "}
          <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
            ทองคำ-เงิน
          </span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          รวม Broker ที่ดีที่สุดสำหรับเทรดทองคำ (XAU/USD) และเงิน (XAG/USD)
          ในประเทศไทย
        </p>
      </div>

      {/* Broker Cards */}
      <div className="space-y-6">
        {brokers.map((broker) => (
          <div
            key={broker.name}
            className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-yellow-950/20 border border-yellow-700/20 rounded-2xl overflow-hidden"
          >
            {/* Highlight badge */}
            {broker.highlight && (
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                  {broker.highlight}
                </span>
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                {/* Logo & Name */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 shadow-lg">
                    <img
                      src={broker.logo}
                      alt={broker.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-50 mt-3">
                    {broker.name}
                  </h2>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {broker.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                    {broker.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-yellow-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <a
                    href={broker.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${broker.color} text-black font-bold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-yellow-500/20 hover:scale-[1.02] transition-all duration-200`}
                  >
                    เปิดบัญชีเทรด {broker.name}
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Why Trade Gold Section */}
      <section className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full" />
          <h2 className="text-xl font-bold text-gray-100">
            ทำไมต้องเทรดทองคำ?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: "🛡️",
              title: "สินทรัพย์ปลอดภัย",
              desc: "ทองคำเป็นสินทรัพย์ Safe Haven ในช่วงตลาดผันผวน ช่วยป้องกันความเสี่ยงจากเงินเฟ้อ",
            },
            {
              icon: "📈",
              title: "สภาพคล่องสูง",
              desc: "ตลาดทองคำเปิด 24 ชั่วโมง 5 วัน มีปริมาณการซื้อขายสูง เข้าออกตลาดได้ง่าย",
            },
            {
              icon: "💰",
              title: "เทรดได้ทั้ง 2 ทาง",
              desc: "สามารถทำกำไรได้ทั้งขาขึ้นและขาลง ด้วย CFD ผ่าน Broker ที่เชื่อถือได้",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-900/80 border border-gray-800/80 rounded-xl p-5"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-base font-semibold text-gray-100 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="mt-12 p-4 bg-gray-900/50 border border-gray-800/50 rounded-xl">
        <p className="text-xs text-gray-600 leading-relaxed text-center">
          คำเตือน: การเทรด Forex และ CFD มีความเสี่ยงสูง
          อาจสูญเสียเงินลงทุนทั้งหมด กรุณาศึกษาข้อมูลให้ดีก่อนตัดสินใจลงทุน
          ลิงก์บางส่วนในหน้านี้เป็นลิงก์แนะนำ (Affiliate)
        </p>
      </div>

      {/* Back to home */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-yellow-400 transition"
        >
          &larr; กลับหน้าข่าว
        </Link>
      </div>
    </div>
  );
}
