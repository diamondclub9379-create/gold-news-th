export default function BrokerCTA() {
  return (
    <div className="border border-gray-700 rounded-sm overflow-hidden mt-8">
      <div className="bg-gray-800 px-3 py-1.5 border-b border-gray-700 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
          Affiliate Links — เว็บไซต์ได้รับค่าคอมมิชชั่น
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm text-amber-400 font-medium mb-1">
          พร้อมเริ่มเทรดทองคำแล้ว?
        </p>
        <p className="font-mono text-[11px] text-gray-500 mb-3">
          เปิดบัญชี Exness สเปรดต่ำ ฝากถอนทันที หรือ XM รับโบนัสฟรี
        </p>
        <div className="flex gap-2 mb-2">
          <a
            href="https://one.exnessonelink.com/a/tgeiigei"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="font-mono text-[11px] font-bold bg-amber-500 text-black px-3 py-1.5 rounded-sm hover:bg-amber-400 transition-colors"
          >
            EXNESS
          </a>
          <a
            href="https://www.xmglobal.com/referral?token=zC0C_t2IhcQtzCOb6Te7xA"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="font-mono text-[11px] font-bold bg-red-600 text-white px-3 py-1.5 rounded-sm hover:bg-red-500 transition-colors"
          >
            XM
          </a>
        </div>
        <p className="font-mono text-[9px] text-gray-600 leading-relaxed">
          การเทรด Forex และ CFD มีความเสี่ยงสูง ท่านอาจสูญเสียเงินลงทุนทั้งหมด
          ไม่ใช่คำแนะนำในการลงทุน
        </p>
      </div>
    </div>
  );
}
