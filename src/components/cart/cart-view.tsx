"use client";

import Image from "next/image";
import Link from "next/link";

import { MAX_QUANTITY, orderMessage } from "@/lib/cart/cart";
import { formatPrice } from "@/lib/format";

import { useCart } from "./cart-provider";

export function CartView({ whatsAppNumber }: { whatsAppNumber?: string }) {
  const { state, dispatch, subtotal, ready } = useCart();

  if (!ready) return <p aria-busy="true">Loading your cart…</p>;

  if (state.lines.length === 0) {
    return (
      <div className="space-y-6 rounded-3xl bg-white p-8 text-center ring-1 ring-blush">
        <p className="text-lg">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">
          Browse desserts
        </Link>
      </div>
    );
  }

  const currency = state.lines[0].currency;
  const orderUrl = `https://wa.me/${whatsAppNumber ?? ""}?text=${encodeURIComponent(orderMessage(state))}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <ul className="h-fit divide-y divide-blush rounded-3xl bg-white ring-1 ring-blush">
        {state.lines.map((line) => (
          <li key={line.slug} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
            <Image
              src={line.image.src}
              alt=""
              width={96}
              height={96}
              className="size-24 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <Link href={`/products/${line.slug}`} className="font-semibold hover:underline">
                {line.name}
              </Link>
              <p className="text-sm text-cocoa-soft">
                {formatPrice(line.price, line.currency)} each
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span>Quantity</span>
              <select
                value={line.quantity}
                aria-label={`Quantity of ${line.name}`}
                onChange={(event) =>
                  dispatch({
                    type: "setQuantity",
                    slug: line.slug,
                    quantity: Number(event.target.value),
                  })
                }
                className="h-10 rounded-full border border-cocoa-soft bg-white px-3"
              >
                {Array.from({ length: MAX_QUANTITY }, (_, index) => index + 1).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <p className="w-28 text-right font-semibold">
              {formatPrice(line.price * line.quantity, line.currency)}
            </p>
            <button
              type="button"
              onClick={() => dispatch({ type: "remove", slug: line.slug })}
              className="text-sm font-medium text-rose-ink underline"
              aria-label={`Remove ${line.name} from cart`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <aside
        aria-labelledby="summary-heading"
        className="h-fit space-y-4 rounded-3xl bg-white p-6 ring-1 ring-blush"
      >
        <h2 id="summary-heading" className="font-display text-2xl font-semibold">
          Order summary
        </h2>
        <p className="flex justify-between text-lg">
          <span>Subtotal</span>
          <span className="font-semibold" data-testid="cart-subtotal">
            {formatPrice(subtotal, currency)}
          </span>
        </p>
        <p className="text-sm text-cocoa-soft">
          Delivery is arranged when we confirm your order on WhatsApp.
        </p>
        <a href={orderUrl} className="btn-primary w-full" target="_blank" rel="noopener noreferrer">
          Send order on WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <button
          type="button"
          onClick={() => dispatch({ type: "clear" })}
          className="w-full text-sm text-cocoa-soft underline"
        >
          Clear cart
        </button>
      </aside>
    </div>
  );
}
