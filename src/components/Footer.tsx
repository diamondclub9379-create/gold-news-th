import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-800 py-3">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-gray-600">
          GOLD NEWS TH &copy; {new Date().getFullYear()}
        </span>
        <nav className="flex gap-4 font-mono text-[11px] text-gray-600">
          <Link href="/" className="hover:text-gray-400 transition-colors">หน้าแรก</Link>
          <Link href="/category/gold" className="hover:text-gray-400 transition-colors">ทองคำ</Link>
          <Link href="/category/silver" className="hover:text-gray-400 transition-colors">เงิน</Link>
          <Link href="/videos" className="hover:text-gray-400 transition-colors">วิดีโอ</Link>
        </nav>
        <span className="font-mono text-[10px] text-gray-700 hidden sm:inline">
          ข่าวแปลโดย AI เพื่อการศึกษาเท่านั้น
        </span>
      </div>
    </footer>
  );
}
