import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-4 space-y-3">
        {/* Disclaimer - visible on all devices */}
        <div className="bg-yellow-500/5 border border-yellow-500/10 rounded px-3 py-2">
          <p className="font-mono text-[10px] text-gray-500 leading-relaxed">
            ข่าวแปลโดย AI จากแหล่งข่าวต่างประเทศ เพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำในการลงทุน
            การลงทุนมีความเสี่ยง ผู้อ่านควรศึกษาข้อมูลและปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจลงทุน
            ลิงก์ Broker บางส่วนเป็นลิงก์ Affiliate ที่เว็บไซต์อาจได้รับค่าคอมมิชชั่น
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-gray-600">
            GOLD NEWS TH &copy; {new Date().getFullYear()}
          </span>
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-[11px] text-gray-600">
            <Link href="/" className="hover:text-gray-400 transition-colors">หน้าแรก</Link>
            <Link href="/category/gold" className="hover:text-gray-400 transition-colors">ทองคำ</Link>
            <Link href="/category/silver" className="hover:text-gray-400 transition-colors">เงิน</Link>
            <Link href="/videos" className="hover:text-gray-400 transition-colors">วิดีโอ</Link>
            <Link href="/about" className="hover:text-gray-400 transition-colors">เกี่ยวกับเรา</Link>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">ติดต่อเรา</Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">ความเป็นส่วนตัว</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">ข้อกำหนด</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
