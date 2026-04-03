import Link from "next/link";

interface CategoryFilterProps {
  active?: string;
}

const categories = [
  { key: "all", label: "ทั้งหมด", href: "/" },
  { key: "gold", label: "ทองคำ", href: "/category/gold" },
  { key: "silver", label: "เงิน", href: "/category/silver" },
];

export default function CategoryFilter({ active = "all" }: CategoryFilterProps) {
  return (
    <div className="flex items-center">
      {categories.map((cat) => (
        <Link
          key={cat.key}
          href={cat.href}
          className={`px-3 py-2 text-[12px] font-mono uppercase tracking-wider transition-colors border-b-2 ${
            active === cat.key
              ? "text-amber-400 border-amber-400"
              : "text-gray-500 border-transparent hover:text-gray-300"
          }`}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
