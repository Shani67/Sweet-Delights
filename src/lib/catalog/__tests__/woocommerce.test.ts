import { describe, expect, it, vi } from "vitest";

import {
  createWooCommerceSource,
  mapProduct,
  parsePrice,
  type WooProductNode,
} from "../woocommerce";
import { htmlToText } from "../html";

const node: WooProductNode = {
  id: "cHJvZHVjdDox",
  slug: "red-velvet-cake",
  name: "Red Velvet Cake",
  shortDescription: "<p>Soft cocoa layers &amp; cream cheese.</p>",
  description: "<p>First paragraph.</p>\n<p>Second <strong>paragraph</strong>.</p>",
  featured: true,
  price: "6500.00",
  stockStatus: "IN_STOCK",
  image: {
    sourceUrl: "https://cms.example.com/wp-content/uploads/cake.jpg",
    altText: "",
    mediaDetails: { width: 800, height: 600 },
  },
  productCategories: { nodes: [{ slug: "cakes", name: "Cakes", description: null }] },
};

describe("parsePrice", () => {
  it("converts a RAW price to cents", () => {
    expect(parsePrice("6500.00")).toBe(650000);
    expect(parsePrice("12.345")).toBe(1235);
  });

  it("uses the lowest price of a variable product range", () => {
    expect(parsePrice("4000.00, 6000.00")).toBe(400000);
  });

  it("returns 0 for missing or invalid prices", () => {
    expect(parsePrice(null)).toBe(0);
    expect(parsePrice("")).toBe(0);
  });
});

describe("htmlToText", () => {
  it("strips tags, decodes entities and keeps paragraphs", () => {
    expect(htmlToText(node.description)).toBe("First paragraph.\n\nSecond paragraph.");
    expect(htmlToText("<script>alert(1)</script>Safe")).toBe("alert(1)Safe");
  });
});

describe("mapProduct", () => {
  it("maps a WooGraphQL node to a storefront product", () => {
    const product = mapProduct(node, "LKR");

    expect(product).toMatchObject({
      slug: "red-velvet-cake",
      summary: "Soft cocoa layers & cream cheese.",
      price: 650000,
      currency: "LKR",
      inStock: true,
      categories: [{ slug: "cakes", name: "Cakes", description: "" }],
    });
    // Empty alt text from the CMS falls back to the product name.
    expect(product.image).toEqual({
      src: "https://cms.example.com/wp-content/uploads/cake.jpg",
      alt: "Red Velvet Cake",
      width: 800,
      height: 600,
    });
  });

  it("uses a placeholder when the product has no image", () => {
    const product = mapProduct({ ...node, image: null, stockStatus: "OUT_OF_STOCK" }, "LKR");
    expect(product.image.src).toBe("/images/placeholder.svg");
    expect(product.inStock).toBe(false);
  });
});

describe("createWooCommerceSource", () => {
  const ok = (body: unknown) =>
    Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));

  it("fetches the catalog once and shares it between getters", async () => {
    const fetchImpl = vi.fn(() =>
      ok({
        data: {
          products: { nodes: [node] },
          productCategories: { nodes: [{ slug: "cakes", name: "Cakes", description: "" }] },
        },
      }),
    );
    const source = createWooCommerceSource({
      endpoint: "https://cms.example.com/graphql",
      currency: "LKR",
      revalidateSeconds: 60,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const [products, categories] = await Promise.all([
      source.getProducts(),
      source.getCategories(),
    ]);

    expect(products).toHaveLength(1);
    expect(categories).toEqual([{ slug: "cakes", name: "Cakes", description: "" }]);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("throws a readable error for GraphQL errors", async () => {
    const fetchImpl = vi.fn(() => ok({ errors: [{ message: "Cannot query field" }] }));
    const source = createWooCommerceSource({
      endpoint: "https://cms.example.com/graphql",
      currency: "LKR",
      revalidateSeconds: 60,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await expect(source.getProducts()).rejects.toThrow(
      "WooCommerce GraphQL error: Cannot query field",
    );
  });
});
