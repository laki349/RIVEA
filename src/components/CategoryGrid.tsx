import Link from "next/link";
import { categories } from "@/data/catalog";
import { CategoryIcon } from "./Icons";

export default function CategoryGrid() {
  return (
    <ul className="grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-8">
      {categories.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/category/${c.slug}`}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-white text-cocoa shadow-soft transition group-hover:-translate-y-0.5 group-hover:border-gold-soft group-hover:text-espresso">
              <CategoryIcon name={c.icon} className="h-7 w-7" />
            </span>
            <span className="text-[12.5px] font-medium leading-tight text-cocoa">
              {c.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
