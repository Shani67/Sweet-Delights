"use client";

import Link from "next/link";

import { useCart } from "./cart-provider";

export function CartLink() {
  const { itemCount } = useCart();

  // The accessible name ("Cart 2 items") starts with the visible text, as WCAG 2.5.3 requires.
  return (
    <Link
      href="/cart"
      className="inline-flex items-center gap-2 rounded-full bg-rose-ink px-3 py-2 sm:px-4 text-sm font-semibold text-white hover:bg-rose-ink-dark"
    >
      Cart
      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-xs text-rose-ink">
        {itemCount}
        <span className="sr-only">{itemCount === 1 ? " item" : " items"}</span>
      </span>
    </Link>
  );
}
