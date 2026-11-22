import type { Metadata } from "next";

import { CategoryNav } from "@/components/category-nav";
import { ProductGrid } from "@/components/product/product-grid";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop all desserts",
  description: "Browse every cake, cupcake and tart from Sweet Delights.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="container-page space-y-8 py-12">
      <header className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Shop all desserts</h1>
        <CategoryNav categories={categories} />
      </header>
      <ProductGrid products={products} headingLevel="h2" />
    </div>
  );
}
