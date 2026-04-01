import Link from "next/link";

export default function BrokerCTA() {
  return (
    <div className="my-8 bg-gradient-to-r from-yellow-950/40 to-amber-950/40 border border-yellow-700/20 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-yellow-400">
            พร้อมเริ่มเทรดทองคำแล้ว?
          </p>
          <p className="text-xs text-gray-400 mt-1">
            เปิดบัญชี Exness สเปรดต่ำ ฝากถอนทันที หรือ XM รับโบนัสฟรี
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="https://one.exnessonelink.com/a/tgeiigei"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-yellow-500/20 transition-all"
          >
            เปิดบัญชี Exness
          </a>
          <a
            href="https://www.xmglobal.com/referral?token=zC0C_t2IhcQtzCOb6Te7xA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-red-500/20 transition-all"
          >
            เปิดบัญชี XM
          </a>
        </div>
      </div>
    </div>
  );
}
