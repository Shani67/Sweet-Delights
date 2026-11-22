import type { Product } from "@/lib/catalog";

import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  headingLevel,
}: {
  products: Product[];
  headingLevel?: "h2" | "h3";
}) {
  if (products.length === 0) {
    return <p className="text-cocoa-soft">No products here yet. Please check back soon.</p>;
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id} className="flex">
          <ProductCard product={product} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
