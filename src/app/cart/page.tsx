import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="container-page py-12">
      <h1 className="mb-8 font-display text-4xl font-bold">Your cart</h1>
      <CartView whatsAppNumber={process.env.ORDER_WHATSAPP_NUMBER} />
    </div>
  );
}
