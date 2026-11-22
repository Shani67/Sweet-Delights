import type { MetadataRoute } from "next";

import { getCategories, getProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/shop"), changeFrequency: "daily", priority: 0.9 },
    ...categories.map((category) => ({
      url: url(`/shop/${category.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: url(`/products/${product.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
