import { describe, expect, it } from "vitest";

import { demoProducts } from "@/lib/catalog/demo-data";

import {
  cartItemCount,
  cartReducer,
  cartSubtotal,
  emptyCart,
  MAX_QUANTITY,
  orderMessage,
  parseStoredCart,
} from "../cart";

const [cake, tart] = [demoProducts[0], demoProducts[4]];

describe("cartReducer", () => {
  it("adds a product and merges repeat adds into one line", () => {
    let state = cartReducer(emptyCart, { type: "add", product: cake, quantity: 1 });
    state = cartReducer(state, { type: "add", product: cake, quantity: 2 });

    expect(state.lines).toHaveLength(1);
    expect(state.lines[0]).toMatchObject({ slug: cake.slug, quantity: 3 });
  });

  it("caps quantity at the maximum", () => {
    const state = cartReducer(emptyCart, { type: "add", product: cake, quantity: 99 });
    expect(state.lines[0].quantity).toBe(MAX_QUANTITY);
  });

  it("removes a line when its quantity is set to zero", () => {
    let state = cartReducer(emptyCart, { type: "add", product: cake, quantity: 2 });
    state = cartReducer(state, { type: "setQuantity", slug: cake.slug, quantity: 0 });
    expect(state.lines).toEqual([]);
  });

  it("calculates item count and subtotal in cents", () => {
    let state = cartReducer(emptyCart, { type: "add", product: cake, quantity: 2 });
    state = cartReducer(state, { type: "add", product: tart, quantity: 1 });

    expect(cartItemCount(state)).toBe(3);
    expect(cartSubtotal(state)).toBe(cake.price * 2 + tart.price);
  });
});

describe("parseStoredCart", () => {
  it("returns an empty cart for missing or broken data", () => {
    expect(parseStoredCart(null)).toEqual(emptyCart);
    expect(parseStoredCart("not json")).toEqual(emptyCart);
    expect(parseStoredCart('{"lines": "nope"}')).toEqual(emptyCart);
  });

  it("drops lines with invalid quantities or prices", () => {
    const valid = cartReducer(emptyCart, { type: "add", product: cake, quantity: 1 }).lines[0];
    const raw = JSON.stringify({
      lines: [valid, { ...valid, slug: "x", quantity: -1 }, { ...valid, slug: "y", price: 1.5 }],
    });
    expect(parseStoredCart(raw).lines).toEqual([valid]);
  });
});

describe("orderMessage", () => {
  it("lists each item and the subtotal", () => {
    const state = cartReducer(emptyCart, { type: "add", product: cake, quantity: 2 });
    const message = orderMessage(state);

    expect(message).toContain("2 x Red Velvet Cake");
    expect(message).toMatch(/Subtotal: LKR\s13,000\.00/);
  });
});
