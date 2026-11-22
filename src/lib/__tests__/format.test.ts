import { describe, expect, it } from "vitest";

import { formatPrice } from "../format";

describe("formatPrice", () => {
  it("formats cents as a currency string", () => {
    // Intl puts a non-breaking space between the currency code and the amount.
    expect(formatPrice(650000, "LKR")).toBe("LKR\u00a06,500.00");
    expect(formatPrice(1999, "USD", "en-US")).toBe("$19.99");
  });
});
