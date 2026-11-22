import catalog from "./demo-catalog.json";
import type { Category, Product } from "./types";

/**
 * demo-catalog.json is the single source for the sample products. The storefront uses it
 * when no backend is configured, and wordpress/seed imports the same file into WooCommerce.
 */
export const demoCategories: Category[] = catalog.categories;

export const demoProducts: Product[] = catalog.products.map((product, index) => ({
  id: `demo-${index + 1}`,
  slug: product.slug,
  name: product.name,
  summary: product.summary,
  description: product.description,
  price: product.price,
  currency: catalog.currency,
  image: {
    src: `/images/products/${product.image.file}`,
    alt: product.image.alt,
    width: product.image.width,
    height: product.image.height,
  },
  categories: demoCategories.filter((category) => product.categories.includes(category.slug)),
  featured: product.featured,
  inStock: product.inStock,
}));
