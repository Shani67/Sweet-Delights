import type { Product } from "@/lib/catalog/types";
import { formatPrice } from "@/lib/format";

export const MAX_QUANTITY = 20;

export type CartLine = {
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: { src: string; alt: string };
  quantity: number;
};

export type CartState = { lines: CartLine[] };

export type CartAction =
  | { type: "add"; product: Product; quantity: number }
  | { type: "setQuantity"; slug: string; quantity: number }
  | { type: "remove"; slug: string }
  | { type: "clear" };

export const emptyCart: CartState = { lines: [] };

const clampQuantity = (quantity: number) =>
  Math.min(MAX_QUANTITY, Math.max(0, Math.floor(quantity)));

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const { product } = action;
      const existing = state.lines.find((line) => line.slug === product.slug);
      if (existing) {
        return cartReducer(state, {
          type: "setQuantity",
          slug: product.slug,
          quantity: existing.quantity + action.quantity,
        });
      }
      const quantity = clampQuantity(action.quantity);
      if (quantity === 0) return state;
      const line: CartLine = {
        slug: product.slug,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image: { src: product.image.src, alt: product.image.alt },
        quantity,
      };
      return { lines: [...state.lines, line] };
    }
    case "setQuantity": {
      const quantity = clampQuantity(action.quantity);
      if (quantity === 0) return cartReducer(state, { type: "remove", slug: action.slug });
      return {
        lines: state.lines.map((line) =>
          line.slug === action.slug ? { ...line, quantity } : line,
        ),
      };
    }
    case "remove":
      return { lines: state.lines.filter((line) => line.slug !== action.slug) };
    case "clear":
      return emptyCart;
  }
}

export function cartItemCount(state: CartState): number {
  return state.lines.reduce((total, line) => total + line.quantity, 0);
}

export function cartSubtotal(state: CartState): number {
  return state.lines.reduce((total, line) => total + line.price * line.quantity, 0);
}

/** Reads a cart saved in localStorage, ignoring anything that does not look like a cart. */
export function parseStoredCart(raw: string | null): CartState {
  if (!raw) return emptyCart;
  try {
    const value = JSON.parse(raw) as Partial<CartState>;
    if (!Array.isArray(value.lines)) return emptyCart;
    const lines = value.lines.filter(
      (line): line is CartLine =>
        typeof line?.slug === "string" &&
        typeof line.name === "string" &&
        Number.isInteger(line.price) &&
        typeof line.currency === "string" &&
        Number.isInteger(line.quantity) &&
        line.quantity > 0 &&
        line.quantity <= MAX_QUANTITY,
    );
    return { lines };
  } catch {
    return emptyCart;
  }
}

/** Builds the order message sent to the bakery on WhatsApp. */
export function orderMessage(state: CartState): string {
  const currency = state.lines[0]?.currency ?? "LKR";
  const items = state.lines.map(
    (line) =>
      `- ${line.quantity} x ${line.name} (${formatPrice(line.price * line.quantity, line.currency)})`,
  );
  return [
    "Hello Sweet Delights, I would like to order:",
    ...items,
    `Subtotal: ${formatPrice(cartSubtotal(state), currency)}`,
  ].join("\n");
}
