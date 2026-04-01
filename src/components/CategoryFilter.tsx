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
    <div className="flex gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.key}
          href={cat.href}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            active === cat.key
              ? "bg-yellow-500 text-black"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
