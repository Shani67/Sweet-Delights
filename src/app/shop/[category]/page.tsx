import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryNav } from "@/components/category-nav";
import { ProductGrid } from "@/components/product/product-grid";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/catalog";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug((await params).category);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/shop/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const [category, categories, products] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
    getProductsByCategory(slug),
  ]);

  if (!category) notFound();

  return (
    <div className="container-page space-y-8 py-12">
      <header className="space-y-4">
        <h1 className="font-display text-4xl font-bold">{category.name}</h1>
        <p className="max-w-prose text-cocoa-soft">{category.description}</p>
        <CategoryNav categories={categories} active={category.slug} />
      </header>
      <ProductGrid products={products} headingLevel="h2" />
    </div>
  );
}
