import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export function ProductCard({
  product,
  headingLevel = "h3",
}: {
  product: Product;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-blush transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-blush">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
        />
        {!product.inStock && (
          <span className="absolute top-3 left-3 rounded-full bg-cocoa px-3 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <Heading className="font-display text-xl font-semibold">
          {/* The link covers the whole card, so the card is one tab stop with a clear name. */}
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </Heading>
        <p className="flex-1 text-sm text-cocoa-soft">{product.summary}</p>
        <p className="font-semibold text-rose-ink">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </article>
  );
}
