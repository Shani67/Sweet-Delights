import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductBySlug, getProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { images: [{ url: product.image.src, alt: product.image.alt }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  const category = product.categories[0];

  return (
    <div className="container-page py-12">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm">
        <ol className="flex flex-wrap gap-2 text-cocoa-soft">
          <li>
            <Link href="/shop" className="underline hover:text-rose-ink">
              Shop
            </Link>
          </li>
          {category && (
            <li>
              <span aria-hidden="true">/ </span>
              <Link href={`/shop/${category.slug}`} className="underline hover:text-rose-ink">
                {category.name}
              </Link>
            </li>
          )}
          <li aria-current="page">
            <span aria-hidden="true">/ </span>
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-blush">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <h1 className="font-display text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-rose-ink">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="text-sm font-medium">{product.inStock ? "In stock" : "Sold out"}</p>
          <div className="space-y-4 text-cocoa-soft">
            {product.description.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
