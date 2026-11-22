"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

import {
  cartItemCount,
  cartReducer,
  cartSubtotal,
  emptyCart,
  parseStoredCart,
  type CartAction,
  type CartState,
} from "@/lib/cart/cart";

const STORAGE_KEY = "sweet-delights-cart";

type CartContextValue = {
  state: CartState;
  dispatch: (action: CartAction) => void;
  itemCount: number;
  subtotal: number;
  /** False until the saved cart has been read, so the UI can avoid flashing an empty cart. */
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

type ProviderState = { cart: CartState; ready: boolean };
type ProviderAction = CartAction | { type: "hydrate"; state: CartState };

function providerReducer(state: ProviderState, action: ProviderAction): ProviderState {
  if (action.type === "hydrate") return { cart: action.state, ready: true };
  return { ...state, cart: cartReducer(state.cart, action) };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [{ cart: state, ready }, dispatch] = useReducer(providerReducer, {
    cart: emptyCart,
    ready: false,
  });

  // Load after mount: localStorage does not exist during server rendering.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage can be blocked (private mode, disabled cookies). The cart still works in memory.
    }
    dispatch({ type: "hydrate", state: parseStoredCart(saved) });
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors for the same reason as above.
    }
  }, [state, ready]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      itemCount: cartItemCount(state),
      subtotal: cartSubtotal(state),
      ready,
    }),
    [state, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
