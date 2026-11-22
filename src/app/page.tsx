import Image from "next/image";
import Link from "next/link";

import { ProductGrid } from "@/components/product/product-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import { bakerySchema } from "@/lib/structured-data";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <>
      <JsonLd data={bakerySchema()} />
      <section className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="space-y-6">
          <p className="text-sm font-semibold tracking-widest text-rose-ink uppercase">
            Handmade in Colombo
          </p>
          <h1 className="font-display text-4xl leading-tight font-bold sm:text-5xl">
            Cakes and desserts for every sweet moment
          </h1>
          <p className="max-w-prose text-lg text-cocoa-soft">
            Celebration cakes, cupcakes and fruit tarts baked fresh to order with real butter, Sri
            Lankan cocoa and seasonal fruit.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary">
              Shop all desserts
            </Link>
            <Link href="#featured" className="btn-secondary">
              See best sellers
            </Link>
          </div>
        </div>
        <div className="relative aspect-[6/5] overflow-hidden rounded-[2rem] shadow-lg">
          <Image
            src="/images/products/red-velvet-cake.webp"
            alt="Red velvet cake with cream cheese frosting"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section id="featured" aria-labelledby="featured-heading" className="container-page py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 id="featured-heading" className="font-display text-3xl font-bold">
            Best sellers
          </h2>
          <Link href="/shop" className="text-sm font-semibold text-rose-ink underline">
            View all
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section aria-labelledby="categories-heading" className="container-page py-12">
        <h2 id="categories-heading" className="mb-8 font-display text-3xl font-bold">
          Shop by category
        </h2>
        <ul className="grid gap-6 sm:grid-cols-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/shop/${category.slug}`}
                className="block h-full rounded-3xl bg-blush p-6 transition-colors hover:bg-white hover:ring-1 hover:ring-rose-ink"
              >
                <span className="font-display text-2xl font-semibold">{category.name}</span>
                <span className="mt-2 block text-sm text-cocoa-soft">{category.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
