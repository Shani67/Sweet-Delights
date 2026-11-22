import "server-only";

import { demoCategories, demoProducts } from "./demo-data";
import type { CatalogSource, Category, Product } from "./types";
import { createWooCommerceSource } from "./woocommerce";

export type { Category, Product } from "./types";

const demoSource: CatalogSource = {
  getProducts: async () => demoProducts,
  getCategories: async () => demoCategories,
};

function createSource(): CatalogSource {
  const endpoint = process.env.WORDPRESS_GRAPHQL_URL;
  if (!endpoint) return demoSource;

  return createWooCommerceSource({
    endpoint,
    currency: process.env.STORE_CURRENCY ?? "LKR",
    revalidateSeconds: Number(process.env.CATALOG_REVALIDATE_SECONDS ?? 300),
  });
}

const source = createSource();

/** True when no WordPress endpoint is configured and the built-in demo catalog is used. */
export const isDemoCatalog = !process.env.WORDPRESS_GRAPHQL_URL;

export async function getProducts(): Promise<Product[]> {
  return source.getProducts();
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.featured).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  return source.getCategories();
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.categories.some((c) => c.slug === slug));
}
