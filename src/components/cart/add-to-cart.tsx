"use client";

import Link from "next/link";
import { useId, useState } from "react";

import type { Product } from "@/lib/catalog/types";
import { MAX_QUANTITY } from "@/lib/cart/cart";

import { useCart } from "./cart-provider";

export function AddToCart({ product }: { product: Product }) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");
  const quantityId = useId();

  if (!product.inStock) {
    return (
      <p className="rounded-2xl bg-blush p-4 text-sm">
        This one is sold out for now. Please check back soon.
      </p>
    );
  }

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        dispatch({ type: "add", product, quantity });
        setStatus(`Added ${quantity} ${product.name} to your cart.`);
      }}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor={quantityId} className="text-sm font-medium">
          Quantity
        </label>
        <select
          id={quantityId}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="h-12 rounded-full border border-cocoa-soft bg-white px-4"
        >
          {Array.from({ length: MAX_QUANTITY }, (_, index) => index + 1).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn-primary h-12">
        Add to cart
      </button>
      {/* Announced by screen readers without moving focus. */}
      <p role="status" className="w-full text-sm">
        {status && (
          <>
            {status}{" "}
            <Link href="/cart" className="font-semibold text-rose-ink underline">
              View cart
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
