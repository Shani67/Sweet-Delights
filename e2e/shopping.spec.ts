import { expect, test } from "@playwright/test";

test("customer can browse, add to cart and prepare a WhatsApp order", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Shop all desserts" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Shop all desserts" })).toBeVisible();

  await page
    .getByRole("navigation", { name: "Product categories" })
    .getByRole("link", { name: "Cakes", exact: true })
    .click();
  await expect(page).toHaveURL(/\/shop\/cakes$/);

  await page.getByRole("link", { name: "Red Velvet Cake" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Red Velvet Cake" })).toBeVisible();

  await page.getByLabel("Quantity").selectOption("2");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByRole("status")).toContainText("Added 2 Red Velvet Cake");
  await expect(page.getByRole("link", { name: "Cart 2 items" })).toBeVisible();

  await page.getByRole("link", { name: "Cart 2 items" }).click();
  await expect(page.getByTestId("cart-subtotal")).toHaveText(/LKR\s13,000\.00/);

  const order = page.getByRole("link", { name: /Send order on WhatsApp/ });
  const href = decodeURIComponent((await order.getAttribute("href")) ?? "");
  expect(href).toContain("2 x Red Velvet Cake");

  // The cart survives a reload.
  await page.reload();
  await expect(page.getByTestId("cart-subtotal")).toHaveText(/LKR\s13,000\.00/);

  await page.getByRole("button", { name: "Remove Red Velvet Cake from cart" }).click();
  await expect(page.getByText("Your cart is empty.")).toBeVisible();
});

test("sold out products cannot be added to the cart", async ({ page }) => {
  await page.goto("/products/strawberry-cream-cake");
  await expect(page.getByText("This one is sold out for now.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to cart" })).toHaveCount(0);
});

test("unknown products show the not found page", async ({ page }) => {
  const response = await page.goto("/products/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "We couldn't find that page" })).toBeVisible();
});

test("SEO essentials are present", async ({ page, request }) => {
  await page.goto("/products/red-velvet-cake");
  await expect(page).toHaveTitle("Red Velvet Cake | Sweet Delights");
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(jsonLd.some((text) => text.includes('"@type":"Product"'))).toBe(true);

  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/products/red-velvet-cake");
});
