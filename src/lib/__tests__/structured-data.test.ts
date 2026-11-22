import { describe, expect, it } from "vitest";

import { demoProducts } from "@/lib/catalog/demo-data";

import { productSchema } from "../structured-data";

describe("productSchema", () => {
  it("describes price and availability for Google rich results", () => {
    const soldOut = demoProducts.find((product) => !product.inStock)!;
    const schema = productSchema(soldOut);

    expect(schema.offers).toMatchObject({
      price: (soldOut.price / 100).toFixed(2),
      priceCurrency: "LKR",
      availability: "https://schema.org/OutOfStock",
    });
    expect(schema.image).toMatch(/^https?:\/\/.+\/images\/products\//);
  });
});
