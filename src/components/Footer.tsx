import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-950 border-t border-gray-800/50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-md flex items-center justify-center">
              <span className="text-black font-black text-[10px]">G</span>
            </div>
            <span className="text-sm font-semibold text-gray-400">Gold News TH</span>
          </div>
          <nav className="flex gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-yellow-500 transition">หน้าแรก</Link>
            <Link href="/category/gold" className="hover:text-yellow-500 transition">ทองคำ</Link>
            <Link href="/category/silver" className="hover:text-yellow-500 transition">เงิน</Link>
          </nav>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-800/30 text-center">
          <p className="text-xs text-gray-600">
            ข่าวทั้งหมดแปลจากแหล่งข่าวต่างประเทศโดย AI เพื่อการศึกษาและติดตามตลาดเท่านั้น
          </p>
        </div>
      </div>
    </footer>
  );
}
