import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-900 border-b border-yellow-600/30">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-lg">
              G
            </div>
            <div>
              <h1 className="text-xl font-bold text-yellow-400">
                Gold News TH
              </h1>
              <p className="text-xs text-yellow-600">
                ข่าวทองคำ-เงิน แปลจากต่างประเทศ
              </p>
            </div>
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/"
              className="text-yellow-300 hover:text-yellow-100 transition text-sm font-medium"
            >
              หน้าแรก
            </Link>
            <Link
              href="/category/gold"
              className="text-yellow-300 hover:text-yellow-100 transition text-sm font-medium"
            >
              ทองคำ
            </Link>
            <Link
              href="/category/silver"
              className="text-yellow-300 hover:text-yellow-100 transition text-sm font-medium"
            >
              เงิน
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
