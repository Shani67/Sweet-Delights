import Link from "next/link";

import type { Category } from "@/lib/catalog";

export function CategoryNav({ categories, active }: { categories: Category[]; active?: string }) {
  const items = [{ slug: undefined, name: "All" }, ...categories];

  return (
    <nav aria-label="Product categories">
      <ul className="flex flex-wrap gap-2">
        {items.map((category) => {
          const isActive = category.slug === active;
          const href = category.slug ? `/shop/${category.slug}` : "/shop";
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "inline-block rounded-full bg-rose-ink px-4 py-2 text-sm font-semibold text-white"
                    : "inline-block rounded-full bg-white px-4 py-2 text-sm font-medium ring-1 ring-blush hover:bg-blush"
                }
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
