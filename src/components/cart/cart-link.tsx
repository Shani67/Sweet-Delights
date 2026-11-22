"use client";

import Link from "next/link";

import { useCart } from "./cart-provider";

export function CartLink() {
  const { itemCount } = useCart();
  const label = itemCount === 1 ? "Cart, 1 item" : `Cart, ${itemCount} items`;

  return (
    <Link
      href="/cart"
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-full bg-rose-ink px-4 py-2 text-sm font-semibold text-white hover:bg-rose-ink-dark"
    >
      <span aria-hidden="true">Cart</span>
      <span
        aria-hidden="true"
        className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-xs text-rose-ink"
      >
        {itemCount}
      </span>
    </Link>
  );
}
