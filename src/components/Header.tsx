import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-yellow-600/20">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl rotate-3 group-hover:rotate-6 transition-transform" />
              <div className="relative w-full h-full bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <span className="text-black font-black text-lg">G</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Gold News TH
              </h1>
              <p className="text-[10px] text-yellow-700 tracking-wide uppercase">
                ข่าวทองคำ-เงิน แปลจากต่างประเทศ
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-sm text-yellow-300/80 hover:text-yellow-100 hover:bg-yellow-500/10 transition-all"
            >
              หน้าแรก
            </Link>
            <Link
              href="/category/gold"
              className="px-3 py-1.5 rounded-lg text-sm text-yellow-300/80 hover:text-yellow-100 hover:bg-yellow-500/10 transition-all"
            >
              ทองคำ
            </Link>
            <Link
              href="/category/silver"
              className="px-3 py-1.5 rounded-lg text-sm text-yellow-300/80 hover:text-yellow-100 hover:bg-yellow-500/10 transition-all"
            >
              เงิน
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
