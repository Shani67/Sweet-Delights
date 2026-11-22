import Image from "next/image";
import Link from "next/link";

import { CartLink } from "@/components/cart/cart-link";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-blush bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Sweet Delights home">
          <Image src="/images/brand-mark.png" alt="" width={32} height={32} priority />
          <span className="font-display text-lg font-bold whitespace-nowrap text-rose-ink sm:text-xl">
            Sweet Delights
          </span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-1 sm:gap-4">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full px-2 py-2 text-sm font-medium hover:bg-blush sm:px-3"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <CartLink />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
