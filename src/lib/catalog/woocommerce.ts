import { htmlToText } from "./html";
import type { CatalogSource, Category, Product } from "./types";

export const CATALOG_CACHE_TAG = "catalog";

const CATALOG_QUERY = /* GraphQL */ `
  query StorefrontCatalog {
    products(first: 100, where: { status: "publish" }) {
      nodes {
        id
        slug
        name
        shortDescription
        description
        featured
        image {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        productCategories {
          nodes {
            slug
            name
            description
          }
        }
        ... on SimpleProduct {
          price(format: RAW)
          stockStatus
        }
        ... on VariableProduct {
          price(format: RAW)
          stockStatus
        }
      }
    }
    productCategories(first: 100, where: { hideEmpty: true }) {
      nodes {
        slug
        name
        description
      }
    }
  }
`;

type WooCategoryNode = { slug: string; name: string; description: string | null };

export type WooProductNode = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  featured: boolean;
  price?: string | null;
  stockStatus?: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER" | null;
  image: {
    sourceUrl: string;
    altText: string | null;
    mediaDetails: { width: number | null; height: number | null } | null;
  } | null;
  productCategories: { nodes: WooCategoryNode[] } | null;
};

export type WooCatalogResponse = {
  products: { nodes: WooProductNode[] };
  productCategories: { nodes: WooCategoryNode[] };
};

const PLACEHOLDER_IMAGE = { src: "/images/placeholder.svg", width: 1200, height: 900 };

/** Converts a WooCommerce RAW price ("6500.00", or "4000.00, 6000.00" for a range) to cents. */
export function parsePrice(raw: string | null | undefined): number {
  const first = raw?.split(",")[0]?.trim();
  const value = Number.parseFloat(first ?? "");
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

export function mapCategory(node: WooCategoryNode): Category {
  return { slug: node.slug, name: node.name, description: htmlToText(node.description) };
}

export function mapProduct(node: WooProductNode, currency: string): Product {
  return {
    id: node.id,
    slug: node.slug,
    name: node.name,
    summary: htmlToText(node.shortDescription),
    description: htmlToText(node.description),
    price: parsePrice(node.price),
    currency,
    image: node.image
      ? {
          src: node.image.sourceUrl,
          alt: node.image.altText || node.name,
          width: node.image.mediaDetails?.width ?? PLACEHOLDER_IMAGE.width,
          height: node.image.mediaDetails?.height ?? PLACEHOLDER_IMAGE.height,
        }
      : { ...PLACEHOLDER_IMAGE, alt: node.name },
    categories: (node.productCategories?.nodes ?? []).map(mapCategory),
    featured: node.featured,
    inStock: node.stockStatus !== "OUT_OF_STOCK",
  };
}

type Options = {
  endpoint: string;
  currency: string;
  revalidateSeconds: number;
  fetchImpl?: typeof fetch;
};

export function createWooCommerceSource({
  endpoint,
  currency,
  revalidateSeconds,
  fetchImpl = fetch,
}: Options): CatalogSource {
  let pending: Promise<WooCatalogResponse> | undefined;

  async function load(): Promise<WooCatalogResponse> {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: CATALOG_QUERY }),
      // Incremental Static Regeneration: pages are static and refresh in the background.
      next: { revalidate: revalidateSeconds, tags: [CATALOG_CACHE_TAG] },
    });

    if (!response.ok) {
      throw new Error(`WooCommerce GraphQL request failed with HTTP ${response.status}`);
    }

    const body = (await response.json()) as {
      data?: WooCatalogResponse;
      errors?: { message: string }[];
    };

    if (body.errors?.length || !body.data) {
      const message = body.errors?.map((error) => error.message).join("; ") ?? "no data";
      throw new Error(`WooCommerce GraphQL error: ${message}`);
    }

    return body.data;
  }

  // One request per render pass: both getters share the same in-flight promise.
  const data = () =>
    (pending ??= load().catch((error) => {
      pending = undefined;
      throw error;
    }));

  return {
    async getProducts() {
      const { products } = await data();
      return products.nodes.map((node) => mapProduct(node, currency));
    },
    async getCategories() {
      const { productCategories } = await data();
      return productCategories.nodes.map(mapCategory);
    },
  };
}
